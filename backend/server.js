const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = 5000;

const app = express();

// connexion à DB
connectDB();

// middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/lead", require("./routes/lead.routes"));
app.use("/dealer", require("./routes/dealer.routes"));
app.use("/user", require("./routes/user.routes"));

// Lancer le server
app.listen(port, () => console.log("Le serveur a démarré au port " + port));

// dzzedzedzedsdcqsdc
