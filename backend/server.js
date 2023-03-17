const express = require("express");
const connectDB = require("./config/db");
const leadRoutes = require("./routes/lead.routes");
const dealerRoutes = require("./routes/dealer.routes");
const userRoutes = require("./routes/user.routes");
const coinRoutes = require("./routes/coin.routes");
const stripeRoutes = require("./routes/stripe.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/auth.user.middleware");
const dotenv = require("dotenv").config();
const cors = require("cors");


const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
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
app.use("/api/dealer", dealerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/coin", coinRoutes);
app.use("/api/stripe", stripeRoutes);

// Lancer le server
app.listen(process.env.PORT, () =>
  console.log("Le serveur a démarré au port " + process.env.PORT)
);
