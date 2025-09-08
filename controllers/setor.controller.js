const db = require("../models");
const Setor = db.setor;
const Op = db.Sequelize.Op;

// Cria e salva um novo Setor
exports.create = (req, res) => {
    // Valida a requisição
    if (!req.body.nome) {
        res.status(400).send({
            message: "O nome do setor é obrigatório!",
        });
        return;
    }

    // Cria o objeto Setor
    const setor = {
        nome: req.body.nome,
        veiculos: req.body.veiculos,
        // gestor: req.body.gestor
    };

    // Salva o Setor no banco de dados
    Setor.create(setor)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a criação do Setor.",
            });
        });
};

// Busca todos os Setores, com opção de filtrar por nome
exports.findAll = (req, res) => {
    const nome = req.query.nome;
    var condition = nome ? { nome: { [Op.iLike]: `%${nome}%` } } : null;

    Setor.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a busca por Setores.",
            });
        });
};

// Busca um único Setor pelo ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Setor.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não foi possível encontrar o Setor com o id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro na busca pelo Setor com id=" + id,
            });
        });
};

// Atualiza um Setor pelo ID
exports.update = (req, res) => {
    const id = req.params.id;

    Setor.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Setor atualizado com sucesso.",
                });
            } else {
                res.send({
                    message: `Não foi possível atualizar o Setor com id=${id}. Talvez não tenha sido encontrado ou o corpo da requisição está vazio!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro ao atualizar o Setor com id=" + id,
            });
        });
};

// Deleta um Setor pelo ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Setor.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Setor deletado com sucesso!",
                });
            } else {
                res.send({
                    message: `Não foi possível deletar o Setor com id=${id}. Não encontrado.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Não foi possível deletar o Setor com o id=" + id,
            });
        });
};

// Deleta TODOS os Setores do banco de dados
exports.deleteAll = (req, res) => {
    Setor.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} Setores foram deletados com sucesso!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Ocorreu um erro enquanto todos os Setores eram deletados.",
            });
        });
};