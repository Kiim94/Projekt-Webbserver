//routes för webbserver
const express = require("express");
const router = express.Router();
const MenyItem = require("../models/MenyItem");
const auth = require("../middleware/authMiddleware");

//route för att hämta hela menyn
router.get("/", async (req, res) => {
    try{
        const meny = await MenyItem.find();
        res.json(meny);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Kunde inte hämta meny"});
    }
})
//route för att hämta EN maträtt
router.get("/:id", async (req, res) => {
    try{
        const item = await MenyItem.findById(req.params.id);
        if(!item){
            return res.status(404).json({ error: "Maträtten/Drycken hittades inte"});
        }
        res.json(item);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internt serverfel"});
    }
})

//hade /meny innan. Fick bara 404 i postman.
//test med bara / => då gick det?!
//tydligen ngt med att med bara / blir det /meny i url, med meny här måste det bli /meny/meny i url?
router.post("/", auth, async (req, res) => {
    console.log(req.body);
    try{
        const { name, price, category, description, allergens} = req.body;
        if(!name || name.trim() === ""){
            return res.status(400).json({ error: "Namnet kan inte lämnas tomt" });
        }
        if(price == null || price <= 0){
            return res.status(400).json({ error: "Priset måste vara större än 0" });
        }
        const result = await MenyItem.create({
            name, price, category, description, allergens
        });
        res.status(201).json(result);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.put("/:id", auth, async (req, res) => {
    console.log(req.body);
    try{
        const { price, name, category, description, allergens} = req.body;
        if(!name || name.trim() === ""){
            return res.status(400).json({ error: "Namn krävs"});
        }
        if(price == null || price <= 0){
            return res.status(400).json({ error: "Pris krävs"});
        }
        const result = await MenyItem.findByIdAndUpdate(
            req.params.id,
            { name, price, category, description, allergens},
            {new: true}
        );
        if(!result){
            res.status(404).json({ error: "Maträtten gick inte att hitta. Saknas id?"});
            return;
        }
        res.status(200).json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internt serverfel" });
    }
})

router.delete("/:id",auth, async (req, res) => {
    try{
        console.log("AUTH OK");
        console.log("ID:", req.params.id);
        const menyId = req.params.id;
        const menyitem = await MenyItem.findByIdAndDelete(menyId);
        console.log("RESULT:", menyitem);
        if(!menyitem){
            return res.status(404).json({ error: "Rätten hittades inte i databasen"});
        }
        res.json({ message: "Maträtten raderad från menyn" });
    }catch(err){
        console.error("DELETE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;