console.log(__dirname);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
console.log("SERVER START")
//server
const app = express();
const PORT = process.env.PORT || 3000;


//middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://bonan.netlify.app"
    ],
    credentials:true
}));

app.use(express.json());

//routes. Hade problem med dessa när test av inlogg gjordes.
//testade att flytta in i functionen startServer(). Fungerade
//Flyttade ut hit: slutade fungera.
//Lämnade datorn ett tag, testade detta igen: fungerade.
//Vet ej varför.
const authRoutes = require("./routes/auth.js");
const menyRoutes = require("./routes/meny.js");
const reviewRoutes = require("./routes/review.js")

//koppla in till server
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/meny", menyRoutes);

//lagt till dessa, för "döda" routes
app.get("/", (req, res) => {
    res.send("Backend server är igång");
});

app.get("/api", (req, res) => {
    res.json({
        status:"ok",
        message: "API fungerar"
    })
})

//anslut MongoDB
async function startServer(){
    try{
        if(!MONGO_URI){
            console.error("MONGO_URI saknas i .env");
            process.exit(1);
        }
        await mongoose.connect(MONGO_URI);
        console.log("Uppkopplad till MongoDB");
        app.listen(PORT, () => {
            console.log("API fungerar på port: " + PORT);
        });
    }catch(err){
        console.error("Kunde inte anslute till MongoDB:", err);
        process.exit(1);
    }
}

startServer();