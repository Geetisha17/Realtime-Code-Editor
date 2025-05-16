const admin = require("firebase-admin");

module.exports = async function verifyToken(req,res,next){
    const token = req.headers.authorization?.split('Bearer ')[1];

    if(!token) return res.status(401).json({error:"Unauthorized: No token "});

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user=decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({error:"Invalid token"});
    }
}