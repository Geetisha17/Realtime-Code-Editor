const request = require('request');
const Code = require("../models/Code");

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
    const {code} = req.body;
    const userId = req.user.uid;

    if(!code) return req.status(400).json({message:"Code is required"});

    try {
        const newCode = new Code({userId,code});
        await newCode.save();
        res.status(201).json({messgae: "Code is succesfully saved"});
    } 
    catch (error) {
        console.log(error);
        req.status(500).json({error:"Failed to save code"});
    }
}

exports.getAllCode = async(req,res)=>{
    const userId = req.user.uid;

    try {
        const codes = await Code.find({userId});
        res.status(200).json({codes});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Unabble to get all Code"});
    }
}

exports.deleteCode = async(req,res)=>{
    const userId = req.user.uid;
    const codeId = req.params.id;

    try {
        const code = await Code.findOneAndDelete({_id:codeId,userId});
        
        if(!code) return res.status(404).json({error:"Code not found"});

        res.json(200).json({message:"Code is succesfully deleted"});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Unable to delete"});
    }
}

exports.updateCode = async(req,res)=>{
    const userId = req.user.uid;
    const codeId = req.params.id;
    const {code} = req.body;

    if(!code) return res.status(400).json({error:"Updated code is required"});


    try {
        const updated = await Code.findByIdAndUpdate({_id:codeId,userId}, 
            {code , updatedAt:Date.now()},
            {new:true}
        );

        if(!updated) return res.status(404).json({error:"Code not found "});

        res.status(200).json({message:"Code updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Failed to update the code"});
    }
}