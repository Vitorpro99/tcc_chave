module.exports = (app) =>{
    const veiculo = require("../controllers/veiculo.controller.js");

    const { verifyToken } = require("../middleware/authJwt.js");

    var router = require("express").Router();
    const multer = require("multer");
         const fs = require("fs");
         var path = require("path");

         var storage = multer.diskStorage({
            destination: function(req,file,cb){
                cb(null,"./uploads/Veiculo");
            },
            filename: function(req,file,cb){
                cb(null,Date.now() + pathextname(file.originalname));
            }
         })

    const upload = multer({
        storage: storage,
    })

    router.post("/upload/", upload.single("file"), (req,res)=>{
        res.send({
            upload:true,
            file: req.file,
        })
    });
    router.get("/upload/:arquivo", (req,res)=>{
        const arquivo = path.dirname(__dirname) + `/uploads/Veiculo/${req.params.arquivo}`;
        fs.readFile(arquivo, function(err,data){
            res.contentType("png");
            res.send(data);
        })
    })
    
    
    

    router.post("/", [verifyToken],veiculo.create);
    
    router.get("/",[verifyToken],veiculo.findAll);
    
    router.get("/:id", [verifyToken],veiculo.findOne);
    
    router.put("/:id",veiculo.update);
    
    router.delete("/:id",veiculo.delete);

    // router.delete("/",veiculo.deleteAll);

    app.use("/veiculos",router);
};