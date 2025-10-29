const db = require("../models");

const Veiculo = db.veiculo;
const Setor = db.setor;
const Op = db.Sequelize.Op;

exports.create = (req,res) =>{
    if(!req.body.marca){
        res.status(400).send({
            message:"Veiculo não pode estar sem marca"
        })
        return;
    }
    const veiculo = {
        marca:          req.body.marca,
        modelo:         req.body.modelo,
        ano:            req.body.ano,
        cor:            req.body.cor,
        kilometragem:   req.body.kilometragem,
        // possuidor: {type: Sequelize},
        dataAquisicao:  req.body.data,
        placa:          req.body.placa,
        setorId:        req.body.setorId,
        foto:           req.body.foto,
        
    };
    Veiculo.create(veiculo)
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.status(500).send({
                message: err.message || "Erro durante a criação de Veiculo"
            });
        });
};

exports.findAll = (req,res) =>{
    const marca  = req.query.marca
    
    var condition = marca ? { marca: { [Op.iLike]: `%${marca}%` } } : null;

    Veiculo.findAll({where: condition, include: [db.setor]})

    

        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.status(500).send({
                message: err.message || "Erro durante a procura por Veiculo",
            })
        })
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Veiculo.findByPk(id, {
        include: [
            db.setor, 
            {
                model: db.manutencao,
                as: 'manutencoes'
            }
  
        ]
    })
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não foi possível encontrar o Veículo com o id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro na busca pelo Veículo com id=" + id,
            });
        });
};

exports.update = (req,res) =>{
    const id = req.params.id;

    Veiculo.update(req.body, {
        where: {id: id},
    })
        .then((num)=>{
            if(num == 1){
                res.send({
                    message: "Veiculo atualizado com sucesso."
                });
            }
            else{
                res.send({
                    message: `Não foi possivel atualizar o Veiculo com o id= ${id}. Talvez o Veiculo
                    não tenha sido encontrado ou req.body está vazio!`,
                })
            } 
        })
        .catch((err)=>{
            res.status(500).send({
                message:"Erro em atualizar o Veiculo via id=" + id,
            });
        });
};

exports.delete = (req,res) =>{
    const id = req.params.id;

    Veiculo.destroy({
        where: { id:id },
    })
        .then((num)=>{
            if(num == 1){
                res.send({
                    message: "Veiculo deletado com sucesso!",
                })
            }
            else{
                res.send({
                    message: `Não é possivel deletar esse Veiculo. Não encontrado`
                })
            }
        }
    )
    .catch((err)=>{
        res.status(500).send({
            message:"Não é possivel deletar o Veiculo com o id" + id,
        })
    })

};

exports.deleteAll = (req,res) =>{
    Veiculo.destroy({
        where: {},
        truncate: false,
    })
        .then((nums)=>{
            res.send({message: `${nums} Veiculos foram deletados com sucesso!` })
        })
        .catch((err)=>{
            res.status(500).send({
                message: err.message || "Erro enquanto deletava os Veiculos"
            })
        })
};

// exports. = (req,res) =>{

// };