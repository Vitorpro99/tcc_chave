const db = require("../models");

const Usuario = db.usuario;

const op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bycrypt = require('bcryptjs');
const secretKey = "chavesegredodetoken";
exports.create = (req,res) => {

    if(!req.body.nome){
        res.status(500).send({
            message: "O nome não pode estar vazio."
        });
            return;
    }

    const usuario = {
        nome:       req.body.nome,
        senha:      bycrypt.hashSync(req.body.senha,10),
        email:      req.body.email,
        numero_reg: req.body.numero_reg,
        setor:      req.body.setor,
        gestor:     req.body.gestor
    }

    Usuario.create(usuario)
        .then((data)=>{
            res.send(data);
        })
        .catch((err)=>{
            res.status(500).send({
                message: err.message || "Erro durante a criação do usuario"
            })
        })

};

exports.findAll = (req, res) => {
    // Alterado para buscar por 'nome' em vez de 'marca'
    const nome = req.query.nome;

    var condition = nome ? { nome: { [Op.iLike]: `%${nome}%` } } : null;

    Usuario.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a procura por Usuário.",
            });
        });
};


exports.findOne = (req, res) => {
    const id = req.params.id;

    Usuario.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não foi possível encontrar o Usuário com o id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro na busca por Usuário pelo id=" + id,
            });
        });
};


exports.update = (req, res) => {
    const id = req.params.id;

    Usuario.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Usuário atualizado com sucesso.",
                });
            } else {
                res.send({
                    message: `Não foi possível atualizar o Usuário com o id=${id}. Talvez o usuário não tenha sido encontrado ou o corpo da requisição (req.body) está vazio!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro ao atualizar o Usuário com id=" + id,
            });
        });
};


exports.delete = (req, res) => {
    const id = req.params.id;

    Usuario.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Usuário deletado com sucesso!",
                });
            } else {
                res.send({
                    message: `Não foi possível deletar o Usuário com id=${id}. Usuário não encontrado.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Não foi possível deletar o Usuário com o id=" + id,
            });
        });
};


exports.deleteAll = (req, res) => {
    Usuario.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Usuários foram deletados com sucesso!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Ocorreu um erro enquanto todos os usuários eram deletados.",
            });
        });
};
exports.login = (req,res) =>{
    Usuario.findOne({
        where:{
            email: req.body.email,
        },
    })
        .then((usuario)=>{
            if(!usuario){
                return res.status(404).send({message: "Usuário não encontrado com esse email!"});
            }

            var passwordIsValid = bycrypt.compareSync(req.body.senha, usuario.senha);
            if(!passwordIsValid){
                return res.status(401).send({
                    accessToken: null,
                    message: "Senha inválida!"
                });
            }
            var token = jwt.sign({id:usuario.id}, secretKey, { expireIn "1h"});
        });
        res.status(200).send({ usuario: usuario, accessToken: token})
        .catch((err)=>{
            res.status(500).send({message: "Erro ao logar com o email" + req.body.email});
        });
    }