const db = require("../models");

const Seguro = db.seguro;

const Op = db.Sequelize.Op;

exports.create = (req,res) =>{

    if(!req.body.numeroApolice){
        res.status(400).send({
            message:"O número da apólice não pode estar vazio."
        })
        return;
    }
    const seguro = {
        numeroApolice: req.body.numeroApolice,
        dataInicio: req.body.dataInicio,
        dataFim: req.body.dataFim,
        valorPremio: req.body.valorPremio,
        valorCobertura: req.body.valorCobertura,
        seguradora: req.body.seguradora,
        status: req.body.status,
        franquia: req.body.franquia,
        tipoSeguro: req.body.tipoSeguro,
        veiculoId: req.body.veiculoId
    }
    Seguro.create(seguro)
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.status(500).send({
                message: err.message || "Erro durante a criação do seguro"
            })
        })

};
exports.findAll = (req,res) =>{
    const numeroApolice  = req.query.numeroApolice

    var condition = numeroApolice ? { numeroApolice: { [Op.iLike]: `%${numeroApolice}%` } } : null;

    Seguro.findAll({where: condition})
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.status(500).send({
                message: err.message || "Erro durante a procura por Seguro",
            })
        })
}
exports.findOne = (req,res) =>{

    const id = req.params.id;

    Seguro.findByPk(id)
        .then((data)=>{
            if(data){
                res.send(data);
            }
            else{
                res.status(404).send({
                    message: "Seguro com o id =" + id + " não foi encontrado."
                })
            }
        })

}
exports.update = (req,res) =>{
    const id = req.params.id;

    Seguro.update(req.body, {
        where: {id: id},
    })
        .then((num)=>{
            if(num == 1){
                res.send({
                    message: "Seguro atualizado com sucesso."
                });
            }
            else{
                res.send({
                    message: `Não é possivel atualizar o Seguro com o id=${id}. Talvez o Seguro não foi encontrado ou o corpo da requisição está vazio!`
                })
            }
        })


}
exports.delete = (req,res) =>{
    const id = req.params.id;

    Seguro.destroy({
        where: {id: id}
        .then((num) =>{
            if(num == 1){
                res.send({
                    message: "Seguro deletado com sucesso!"
                });
            }
            else{
                res.send({
                    message: `Não é possivel deletar o Seguro com o id=${id}. Talvez o Seguro não foi encontrado!`
                });
            }
        })
    })
        .catch((err)=>{
            res.status(500).send({
                message: "Não foi possivel deletar o Seguro com o id=" + id
            })
        })

}
exports.deleteAll = (req,res) =>{
    Seguro.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Seguros foram deletados com sucesso!` });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Ocorreu um erro ao deletar todos os Seguros.",
            });
        }
    )
};
