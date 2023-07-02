const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const stripeRoutes = require("./routes/stripe.routes");
const messageRoutes = require("./routes/message.routes");
const annonceRoutes = require("./routes/annonce.routes");
const roomRoutes = require("./routes/room.routes");
const offerRoutes = require("./routes/offer.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.user.middleware");
const cors = require("cors");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const jwtSecret =
  "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5ceyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
const UserModel = require("./models/user.model");
const MessageModel = require("./models/message.model");
const OfferModel = require("./models/offer.model");
const sendEmail = require("./utils/sendEmail.utils");

const app = express();

// origin: "http://localhost:3000",

const corsOptions = {
  AccessControlAllowOrigin: "http://deeel-app.com/",
  origin: "http://deeel-app.com/",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

// connexion à DB
connectDB();

// middleware qui permet de traiter les données de la Request (lire le body, url et cookies)
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals);
});

// routes
app.use("/api/lead", leadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/coin", coinRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/annonce", annonceRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/offer", offerRoutes);

// Lancer le server
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log("Server is running au port " + port)
);

const wss = new ws.WebSocketServer({ server });

// récupérer les infos user from jwt token
wss.on("connection", (connection, req) => {
  // console.log("connected to ws");
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith(" jwt="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const user = await UserModel.findById(userData.id);
          connection.userId = userData.id;
        });
      }
    }
  }

  // checker qui est online
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((u) => ({
          userId: u.userId,
        })),
      })
    );
  });

  // envoyer les messages aux clients
  connection.on("message", async (message) => {
    const msgData = await JSON.parse(message.toString());
    console.log(msgData);
    if (
      msgData.message.recipient &&
      msgData.message.text &&
      msgData.message.sender
    ) {
      const messageDoc = await MessageModel.create({
        roomID: msgData.message.uniqueRoomID,
        senderID: msgData.message.sender,
        recipientID: msgData.message.recipient,
        text: msgData.message.text,
      });
      [...wss.clients]
        .filter((c) => c.userId === msgData.message.recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              roomID: msgData.message.uniqueRoomID,
              senderID: msgData.message.sender,
              recipientID: msgData.message.recipient,
              text: msgData.message.text,
              _id: messageDoc._id,
            })
          )
        );
    } else if (msgData.message.price) {
      const user = await UserModel.findById(msgData.message.recipientID);
      const offerDoc = await OfferModel.findOneAndUpdate(
        {
          uniqueRoomID: msgData.message.uniqueRoomID,
        },
        { $set: { price: msgData.message.price } }
      );

      const url2 = "www.google.com";
      const text = `Bonjour ${user.pseudo}, vous venez de recevoir une offre d'un informateur. Connectez-vous pour accepter ou refuser l'offre. Cordialement, deeel `;

      await sendEmail(
        user.email,
        "Un informateur vous fait une offre - deeel",
        text,
        url2
      );

      if (offerDoc !== null) {
        [...wss.clients]
          .filter((c) => c.userId === offerDoc.recipientID)
          .forEach((c) =>
            c.send(
              JSON.stringify({
                uniqueRoomID: offerDoc.uniqueRoomID,
                annonceID: offerDoc.annonceID,
                recipientID: offerDoc.recipientID,
                userID: offerDoc.userID,
                price: offerDoc.price,
                _id: offerDoc._id,
              })
            )
          );
      }
      if (offerDoc === null) {
        const offerDoc = await OfferModel.create({
          uniqueRoomID: msgData.message.uniqueRoomID,
          annonceID: msgData.message.annonceID,
          recipientID: msgData.message.recipientID,
          userID: msgData.message.userID,
          price: msgData.message.price,
        });
        console.log({ create: offerDoc });
        [...wss.clients]
          .filter((c) => c.userId === offerDoc.recipientID)
          .forEach((c) =>
            c.send(
              JSON.stringify({
                uniqueRoomID: offerDoc.uniqueRoomID,
                annonceID: offerDoc.annonceID,
                recipientID: offerDoc.recipientID,
                userID: offerDoc.userID,
                price: offerDoc.price,
                _id: offerDoc._id,
              })
            )
          );
      }
    }
  });
});
