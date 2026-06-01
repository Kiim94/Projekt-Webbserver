//routes för webbserver
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");

//För inloggning - restaurangarbetare/admin
//hämta modell från User.js
const Admin = require("../models/Admin");

//routes för Admin
//!!!! ingen registrering eller signup på start. Besökare ska inte kunnna skapa en användare
router.post("/login", async (req, res) => {
    try{
        const { username, password } = req.body;

        //om inget användarnamn/lösenord
        if(!username || !password){
            return res.status(400).json({ error: "Vänligen skriv in både användarnamn och lösenord"});
        }
        const admin = await Admin.findOne({ username });
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
        res.status(500).json({ error: "Internt serverfel" });
    }
});

router.post("/register", async (req, res) => {
    try{

        //variabel för användarnamn, email och lösenord när ny användare ska registreras
        const {username, password } = req.body;
        
        if(!username || !password){
            return res.status(400).json({ error: "Ogiltigt input: skriv in användarnamn och lösenord" });
        }

        //kontroll om användarnamn redan existerar
        const usernameExists = await Admin.findOne({ username });
        if(usernameExists){
            return res.status(400).json({ error: "Användarnamnet används redan"})
        }
        
        //kryptera lösenord. 10 är standard, bestämmer hur tung beräkning blir (hur svårt det är att knäcka lösenord)
        const cryptPass = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            username, password: cryptPass //krypterat lösenord
        });
        res.status(201).json({ message: "Admin skapad"});
    }catch (err){
        console.error(err);
        return res.status(500).json({ error: "Serverfel! Kunde inte skapa administratör" });
    }
})

router.delete("/admins/:id", auth, async (req, res) => {
    try{
        const deleted = await Admin.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({ error: "Admin hittades inte" });
        }
        res.json({ message: "Admin borttagen" });
    }catch(err){
        res.status(500).json({ error: "Kunde inte ta bort admin" });
    }
})

module.exports = router;