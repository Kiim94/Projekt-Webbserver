//schema för admin
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin"
    }
});

//sista "admin" -> hade problem att hitta rätt: console.log visade att det fanns en användare/inloggning
//visade rätt lösenord/användarnamn
//fungerade ändå inte i postman
//admin på slutet: tvinga att titta i korrekt collection namn i databasen
module.exports = mongoose.model("Admin", adminSchema, "admin");