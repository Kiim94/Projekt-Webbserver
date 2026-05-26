//routes för webbserver
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//För inloggning - restaurangarbetare/admin
//hämta modell från User.js
const Admin = require("../models/Admin");

//routes för Admin
//!!!! ingen registrering eller signup. Besökare ska inte kunnna skapa en användare
router.post("/login", async (req, res) => {
    try{
        const { username, password } = req.body;

        //funderade på att ha username och password kontroll var för sig. Men det kanske ger ledtrådar åt icke behöriga
        if(!username || !password){
            return res.status(400).json({ error: "Vänligen skriv in både användarnamn och lösenord"});
        }
        const admin = await Admin.findOne({ username: username });
        if(!admin){
            return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
        }
        const isMatched = await bcrypt.compare(password, admin.password);
        if(!isMatched){
            return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
        }
        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username
            },
            process.env.JWT_SECRET,
            {expiresIn: "1h" }
        );
        res.json({ message: "Lyckat login", token });
    }catch(err){
        res.status(500).json({ error: "Intert serverfel" });
    }
});

module.exports = router;