const express = require("express");
const bodyPhaser = require("body-parser")
const cors = require("cors")

const app = express();

app.get("/", function (req,res){
    res.send("Chave pra chave")
});

var corsOptions = {

    origin:"http://localhost:3000"

}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended:true}));

const db = require("./models")

db.sequelize
    .sync({alter:true})
    .then(() =>{
        console.log("Ola mundo!");
    })
    .catch((err)=>{
        console.log("Failed to sync db: " + err.message);
    })

require("./routes/ipva.routes.js") (app);
require("./routes/manutencao.routes.js") (app);
require("./routes/multa.routes.js") (app);
require("./routes/seguro.routes.js") (app);
require("./routes/setor.routes.js") (app);
require("./routes/usuario.routes.js") (app);
require("./routes/veiculo.routes.js") (app);
require("./routes/transferencia.routes.js")(app); 

app.listen(8000,function (req,res){
    console.log("App rodando na porta 8000");
});