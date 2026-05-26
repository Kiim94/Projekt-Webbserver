const jwt = require("jsonwebtoken");

//middleware för jwt
function auth(req, res, next){
    console.log(req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({ error: "Ingen token har skickats" });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        console.error(err);
        return res.status(401).json({ error: "Ogiltig token" });
    }
}

module.exports = auth;