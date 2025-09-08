const db = require("../models");
const Manutencao = db.manutencao; // Certifique-se que este nome corresponde à exportação no seu /models/index.js
const Op = db.Sequelize.Op;

// Cria e salva uma nova Manutenção
exports.create = (req, res) => {
    // Valida a requisição
    if (!req.body.tipo || req.body.valor === undefined) {
        res.status(400).send({
            message: "O tipo e o valor da manutenção não podem estar vazios!",
        });
        return;
    }

    // Cria o objeto Manutencao
    const manutencao = {
        data: req.body.data,
        tipo: req.body.tipo,
        valor: req.body.valor,
        observacoes: req.body.observacoes,
        // Normalmente você associaria a um veículo aqui, recebendo o ID dele. Ex:
        // veiculoId: req.body.veiculoId 
    };

    // Salva no banco de dados
    Manutencao.create(manutencao)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a criação da Manutenção.",
            });
        });
};

// Busca todas as manutenções, com opção de filtrar por tipo
exports.findAll = (req, res) => {
    const tipo = req.query.tipo;
    var condition = tipo ? { tipo: { [Op.iLike]: `%${tipo}%` } } : null;

    Manutencao.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a busca por Manutenções.",
            });
        });
};

// Busca uma única manutenção pelo ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Manutencao.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não foi possível encontrar a Manutenção com o id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro na busca pela Manutenção com id=" + id,
            });
        });
};


exports.update = (req, res) => {
    const id = req.params.id;

    Manutencao.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Manutenção atualizada com sucesso.",
                });
            } else {
                res.send({
                    message: `Não foi possível atualizar a Manutenção com id=${id}. Talvez ela não tenha sido encontrada ou o corpo da requisição está vazio!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro ao atualizar a Manutenção com id=" + id,
            });
        });
};

// Deleta uma manutenção pelo ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Manutencao.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Manutenção deletada com sucesso!",
                });
            } else {
                res.send({
                    message: `Não foi possível deletar a Manutenção com id=${id}. Não encontrada.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Não foi possível deletar a Manutenção com o id=" + id,
            });
        });
};

exports.deleteAll = (req, res) => {
    Manutencao.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Manutenções foram deletadas com sucesso!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Ocorreu um erro enquanto todas as manutenções eram deletadas.",
            });
        });
};