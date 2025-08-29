const express = require("express");
const bodyPhaser = require("body-parser")
const cors = require("cors")

const app = express();

app.get("/", function (req,res){
    res.send("Chave pra chave")
});

var corsOptions = {

    origin:"Aqui informar quais urls serão permitidas conectar ao backend"

}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended:true}));

const db = require("./models");

db.sequelize
    .sync({alter:true})
    .then(() =>{
        console.log("Synced db");
    })
    .catch((err)=>{
        console.log("Failed to sync db: " + err.message);
    })

app.listen(8000,function (req,res){
    console.log("App rodando na porta 8000");
});