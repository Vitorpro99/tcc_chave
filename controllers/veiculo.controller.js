const db = require("../models");

const Veiculo = db.veiculo;

const Op = db.Sequelize.Op;

exports.create = (req,res) =>{
    if(!req.body.marca){
        res.status(400).send({
            message:"Veiculo não pode estar sem marca"
        })
        return;
    }
    const veiculo = {
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano: req.body.ano,
        kilometragem: req.body.kilometragem,
        // possuidor: {type: Sequelize}
        dataAquisicao: req.body.data,
        placa: req.body.placa
        
    };
    Produto.create(produto)
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.status(500).send({
                message: err.message || "Erro durante a criação de Produto"
            });
        });
};

exports.findAll = (req,res) =>{
    const marca  = req.query.marca

    var condition = marca ? { marca: { [Op.iLike]: `%${marca}%` } } : null;

    Veiculo.findAll({where: condition})
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res,status(500).send({
                message: err.message || "Erro durante a procura por Produto",
            })
        })
};

exports.findOne = (req,res) =>{
    const id = req.params.id;

    Produto.findByPk(id)
    .then((data)=>{
        if(data){
            res.send(data);
        }
        else{
            res.status(404).send({
                message: `Não é possivel achar o Veiculo com o id=` + id    ,
            });
        }
    })
    .catch((err)=>{
        res.status(500).send({
            message: "Erro na busca por Produto pelo id" + id
        })
    })
};

exports.update = (req,res) =>{

};

exports.delete = (req,res) =>{

};

exports.deleteAll = (req,res) =>{

};

// exports. = (req,res) =>{

// };