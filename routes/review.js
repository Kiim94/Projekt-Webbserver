//routes för gästbok/recensions-sida
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/authMiddleware");

//GET
router.get("/", async (req, res) => {
    try{
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    }catch(err){
        res.status(500).json({ error: "Kunde inte hämta recensioner" });
    }
})


router.post("/", async (req, res) => {
    try{
        const { name, message, rating } = req.body;
        if(!name || !message || !rating){
            return res.status(400).json({ error: "Namn,meddelande och rating krävs" });
        }
        const review = await Review.create({
            name, message, rating
        });
        res.status(201).json(review);
    }catch(err){
        res.status(500).json({ error: "Kunde inte skapa inlägg" });
    }
})

//DELETE för admin
router.delete("/:id", auth, async (req, res) => {
    try{
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({ error: "Inlägg hittades inte" });
        }
        res.json({ message: "Inlägg borttaget" });
    }catch(err){
        res.status(500).json({ error: "Fel vid radering" });
    }
})

module.exports = router;