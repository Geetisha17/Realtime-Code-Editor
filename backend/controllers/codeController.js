const request = require('request');
const Code = require("../models/Code");
const redisClient = require('../redisClient');

exports.executeCode = (req,res)=>{
    const { language, script } = req.body;

    const program = {
        script: script,
        language: language,
        versionIndex: "0",
        clientId: "97b63abb86f4cf9326c2643bd93d25c9",
        clientSecret: "4be49679e4106419ea9894c846ffab09bf721ae3a475fcc88a19c1f1566fea7",
    };

    request({
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program,
    }, function (error, response, body) {
        if (error) {
            res.status(500).send({ error: 'Error executing code' });
        } else {
            res.status(response.statusCode).send(body);
        }
    });
}

exports.getCompileMessage = (req,res)=>{
    res.send({output: 'Output of the executed code'})
};

exports.saveCode = async(req,res)=>{
    const {code , userId} = req.body;

    if (!code || !userId) {
        return res.status(400).json({ message: "Code and userId are required" });
    }

    try {
        const newCode = new Code({userId,code});
        await newCode.save();

        await redisClient.del(`code:${userId}`);
        res.status(201).json({message: "Code is succesfully saved"});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to save code"});
    }
}

exports.getAllCode = async(req,res)=>{
    const {userId} = req.params;

    try {
        const cached = await redisClient.get(`code:${userId}`);

        if(cached)
            return res.status(200).json({codes: JSON.parse(cached),cached: true});
        
        const codes = await Code.find({userId});

        await redisClient.set(`code:${userId}`, JSON.stringify(codes), {EX:3600});
        res.status(200).json({codes});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Unable to get all Code"});
    }
}

exports.deleteCode = async(req,res)=>{
    const {userId, id:codeId} = req.params;

    try {
        const code = await Code.findOneAndDelete({_id:codeId,userId});
        
        if(!code) return res.status(404).json({error:"Code not found"});

        await redisClient.del(`code:${userId}`);

        res.status(200).json({message:"Code is succesfully deleted"});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Unable to delete"});
    }
}

exports.updateCode = async(req,res)=>{
    const {id: codeId, userId} = req.params;
    const {code} = req.body;

    if(!code) return res.status(400).json({error:"Updated code is required"});
    try {
        const updated = await Code.findByIdAndUpdate(
            {_id:codeId, userId}, 
            {code , updatedAt:Date.now()},
            {new:true}
        );

        if(!updated) return res.status(404).json({error:"Code not found "});


        await redisClient.del(`code:${userId}`);
        res.status(200).json({message:"Code updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to update the code"});
    }
}