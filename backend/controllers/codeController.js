const request = require('request');

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
    exports.getCompileMessage = (req,res)=>{
        res.send({output: 'Output of the executed code'})
    };
}