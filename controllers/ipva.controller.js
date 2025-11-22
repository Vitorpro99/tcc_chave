const db = require("../models");
const Ipva = db.ipva; 
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
exports.findOne = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    try {
        // 1. Busca o Usuário
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            return res.status(404).send({ message: "Usuário não encontrado." });
        }

        // 2. Busca o Veículo com todas as relações
        // NOTA: Se der erro aqui, verifique se os 'as' batem com o models/index.js
        const veiculo = await Veiculo.findByPk(id, {
            include: [
                { model: db.setor, as: 'setor' }, // Traz o setor (se tiver relação 'as: setor') ou remova o 'as' se não tiver
                { model: db.manutencao, as: 'manutencoes' },
                { model: db.multa, as: 'multas' },
                { model: db.ipva, as: 'ipvaVeiculo' }
            ]
        });

        if (!veiculo) {
            return res.status(404).send({ message: "Veículo não encontrado." });
        }

        // 3. VERIFICAÇÃO DE SEGURANÇA (BLINDAGEM)
        if (!usuario.admin) {
            // Se o usuário tiver setor definido E o veículo tiver setor definido
            // E eles forem diferentes -> BLOQUEIA
            if (usuario.setorId && veiculo.setorId && veiculo.setorId !== usuario.setorId) {
                return res.status(403).send({ 
                    message: "Acesso negado: Este veículo pertence a outro setor." 
                });
            }
        }

        res.send(veiculo);

    } catch (err) {
        console.error("ERRO NO FINDONE:", err); // Isto vai mostrar o erro real no terminal
        res.status(500).send({ message: "Erro ao buscar veículo: " + err.message });
    }
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
exports.delete = (req, res) => {
    const id = req.params.id;

    Ipva.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "IPVA deletado com sucesso!",
                });
            } else {
                res.send({
                    message: `Não foi possível deletar o IPVA com id=${id}. Talvez não tenha sido encontrado.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Não foi possível deletar o IPVA com id=" + id,
            });
        });
};
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