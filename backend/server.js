const express = require("express");
const connectDB = require("./config/db");
const leadRoutes = require("./routes/lead.routes");
const userRoutes = require("./routes/user.routes");
const coinRoutes = require("./routes/coin.routes");
const stripeRoutes = require("./routes/stripe.routes");
const conversationRoutes = require("./routes/conversation.routes");
const messageRoutes = require("./routes/message.routes");
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

const app = express();

// origin: "http://localhost:3000",

const corsOptions = {
  origin: "http://localhost:3000",
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
        convID: msgData.message.convId,
        senderID: msgData.message.sender,
        recipientID: msgData.message.recipient,
        text: msgData.message.text,
      });
      [...wss.clients]
        .filter((c) => c.userId === msgData.message.recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              convID: msgData.message.convId,
              senderID: msgData.message.sender,
              recipientID: msgData.message.recipient,
              text: msgData.message.text,
              _id: messageDoc._id,
            })
          )
        );
    }
  });
});
