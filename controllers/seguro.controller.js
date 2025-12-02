const db = require("../models");
const Seguro = db.seguro;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.numeroApolice || !req.body.veiculoId) {
        res.status(400).send({
            message: "O número da apólice e o veículo são obrigatórios."
        });
        return;
    }

    const seguro = {
        numeroApolice: req.body.numeroApolice,
        dataInicio: req.body.dataInicio,
        dataFim: req.body.dataFim,
        
        // CORREÇÃO: Usando os nomes do Modelo atual
        valor: req.body.valor,       // Antes era valorPremio
        franquia: req.body.franquia,
        tipoSeguro: req.body.tipoSeguro, // Usamos este campo para Seguradora/Tipo
        status: req.body.status || "Ativo", // Define padrão se não vier
        
        veiculoId: req.body.veiculoId
    };

    Seguro.create(seguro)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a criação do seguro"
            });
        });
};

exports.findAll = (req, res) => {
    const numeroApolice = req.query.numeroApolice;
    // Precisamos converter para string para usar o iLike se o campo for numero no banco
    // Mas se for busca exata, basta: { numeroApolice: numeroApolice }
    var condition = numeroApolice ? { numeroApolice: numeroApolice } : null;

    Seguro.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a procura por Seguro",
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Seguro.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: "Seguro com o id =" + id + " não foi encontrado."
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao buscar seguro: " + id });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Seguro.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({ message: "Seguro atualizado com sucesso." });
            } else {
                res.send({
                    message: `Não é possível atualizar o Seguro com o id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Erro ao atualizar seguro." });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    // CORREÇÃO DE SINTAXE: O .then estava dentro do objeto de configuração
    Seguro.destroy({
        where: { id: id }
    }) // <--- Fechei o parêntese aqui
    .then((num) => {
        if (num == 1) {
            res.send({ message: "Seguro deletado com sucesso!" });
        } else {
            res.send({
                message: `Não é possível deletar o Seguro com o id=${id}.`
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            message: "Não foi possível deletar o Seguro com o id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    Seguro.destroy({
        where: {},
        truncate: false,
    })
    .then((nums) => {
        res.send({ message: `${nums} Seguros foram deletados com sucesso!` });
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message || "Ocorreu um erro ao deletar todos os Seguros.",
        });
    });
};