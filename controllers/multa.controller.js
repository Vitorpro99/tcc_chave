const db = require("../models");
const Multa = db.multa;
const Op = db.Sequelize.Op;

// Cria e salva uma nova Multa
exports.create = (req, res) => {
    // Valida a requisição
    if (!req.body.data || req.body.valor === undefined) {
        res.status(400).send({
            message: "A data e o valor da multa são obrigatórios!",
        });
        return;
    }

    // Cria o objeto Multa
    const multa = {
        data:       req.body.data,
        valor:      req.body.valor,
        descricao:  req.body.descricao,
        // Geralmente uma multa está associada a um veículo e/ou um usuário (condutor)
        veiculoId:  req.body.veiculoId,
        usuarioId:  req.body.usuarioId
    };

    // Salva a Multa no banco de dados
    Multa.create(multa)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a criação do registro de Multa.",
            });
        });
};

// Busca todos os registros de Multa
exports.findAll = (req, res) => {
    // Para este modelo, não há um campo de texto óbvio para busca simples (como nome ou tipo).
    // A busca é feita sem filtros, retornando todos os registros.
    Multa.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a busca por registros de Multa.",
            });
        });
};

// Busca um único registro de Multa pelo ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Multa.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não foi possível encontrar a Multa com o id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro na busca pela Multa com id=" + id,
            });
        });
};

// Atualiza um registro de Multa pelo ID
exports.update = (req, res) => {
    const id = req.params.id;

    Multa.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Multa atualizada com sucesso.",
                });
            } else {
                res.send({
                    message: `Não foi possível atualizar a Multa com id=${id}. Talvez não tenha sido encontrada ou o corpo da requisição está vazio!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro ao atualizar a Multa com id=" + id,
            });
        });
};

// Deleta um registro de Multa pelo ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Multa.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Multa deletada com sucesso!",
                });
            } else {
                res.send({
                    message: `Não foi possível deletar a Multa com id=${id}. Não encontrada.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Não foi possível deletar a Multa com o id=" + id,
            });
        });
};

// Deleta TODOS os registros de Multa do banco de dados
exports.deleteAll = (req, res) => {
    Multa.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Multas foram deletadas com sucesso!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Ocorreu um erro enquanto todas as Multas eram deletadas.",
            });
        });
};