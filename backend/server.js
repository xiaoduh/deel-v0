const express = require("express");
const connectDB = require("./config/db");
const leadRoutes = require("./routes/lead.routes");
const userRoutes = require("./routes/user.routes");
const coinRoutes = require("./routes/coin.routes");
const stripeRoutes = require("./routes/stripe.routes");
const conversationRoutes = require("./routes/conversation.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.user.middleware");
const cors = require("cors");

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

// Lancer le server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running au port " + port));
