const db = require("../models");
const Ipva = db.ipva; // Certifique-se que a exportação em /models/index.js está correta
const Op = db.Sequelize.Op;

// Cria e salva um novo registro de IPVA
exports.create = (req, res) => {
    // Valida a requisição
    if (!req.body.ano || req.body.valor === undefined) {
        res.status(400).send({
            message: "O ano e o valor do IPVA são obrigatórios!",
        });
        return;
    }

    // Cria o objeto IPVA
    const ipva = {
        ano: req.body.ano,
        valor: req.body.valor,
        descricao: req.body.descricao,
        veiculoId: req.body.veiculoId, // Se a relação for por ID, seria: veiculoId: req.body.veiculoId
    };

    // Salva no banco de dados
    Ipva.create(ipva)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a criação do registro de IPVA.",
            });
        });
};

// Busca todos os registros de IPVA, com opção de filtrar por ano
exports.findAll = (req, res) => {
    const ano = req.query.ano;
    var condition = ano ? { ano: { [Op.iLike]: `%${ano}%` } } : null;

    Ipva.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Erro durante a busca por registros de IPVA.",
            });
        });
};

// Busca um único registro de IPVA pelo ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Ipva.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Não foi possível encontrar o registro de IPVA com o id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro na busca pelo registro de IPVA com id=" + id,
            });
        });
};

// Atualiza um registro de IPVA pelo ID
exports.update = (req, res) => {
    const id = req.params.id;

    Ipva.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "IPVA atualizado com sucesso.",
                });
            } else {
                res.send({
                    message: `Não foi possível atualizar o IPVA com id=${id}. Talvez não tenha sido encontrado ou o corpo da requisição está vazio!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erro ao atualizar o IPVA com id=" + id,
            });
        });
};

// Deleta um registro de IPVA pelo ID
exports.deleteAll = (req, res) => {
    Ipva.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({ message: `${nums} registros de IPVA foram deletados com sucesso!` });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Ocorreu um erro enquanto todos os registros de IPVA eram deletados.",
            });
        });
};