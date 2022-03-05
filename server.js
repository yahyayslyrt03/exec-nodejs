const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const filesystem = require("file-system");
const fs = require("fs");
const fsPromises = fs.promises;


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.post("/exec", async (req,res) => {
    const command = req.body.command;
    const port = req.body.port;
    const workspace = req.body.workspace;
    fs.readFile("test.py","utf-8",async function(err,data){
        if(err){
            return console.log(err);
        }
        let result = await data.replace("commandlinewillbechanged",`${command}`);

        fs.writeFile("test.py",result,"utf-8",function(err){
            if (err) return console.log(err);
        });
        fs.close(1,(err) => {
            if(err) throw err;
            console.log("no errors");
        });
        let b = await {"data":""}
        const {stdout, stderr} = await exec(`ampy -p ${port} run test.py`)
        b.data = await stdout
        res.send(b)

    });
    fs.readFile("test.py","utf-8",async function(err,data){
        if(err){
            return console.log(err);
        }
        let result2 = await data.replace(`${command}`,"commandlinewillbechanged");
        
        fs.writeFile("test.py",result2,"utf-8",function(err){
            if(err) return console.log(err);
           
        });
        fs.close(1,(err) => {
            if(err) throw err;
            console.log("no errors");
        });
        
    })

});

server.listen(3000, () => {
    console.log("3000 portundan server ayaklandı");
}); 