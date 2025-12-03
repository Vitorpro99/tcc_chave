const db = require("../models");
const Veiculo = db.veiculo;
const Setor = db.setor;
const Usuario = db.usuario; // Importante para a segurança
const Op = db.Sequelize.Op;

// =====================================================================
// 1. CRIAR VEÍCULO
// =====================================================================
exports.create = (req, res) => {
    if (!req.body.marca || !req.body.placa) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    const veiculo = {
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano: req.body.ano,
        cor: req.body.cor,
        placa: req.body.placa,
        dataAquisicao: req.body.dataAquisicao,
        setorId: req.body.setorId
    };

    Veiculo.create(veiculo)
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message || "Erro ao criar veículo." });
        });
};

// =====================================================================
// 2. LISTAR TODOS (COM FILTRO DE SEGURANÇA)
// =====================================================================
exports.findAll = async (req, res) => {
    try {
        const userId = req.userId;
        const usuario = await Usuario.findByPk(userId);

        // SEGURANÇA: Verifica se o usuário existe
        if (!usuario) {
            return res.status(401).send({ message: "Usuário não encontrado. Faça login novamente." });
        }

        let condition = {};

        // Se não for admin, vê apenas carros do seu setor
        if (!usuario.admin) {
            if (!usuario.setorId) return res.send([]); 
            condition.setorId = usuario.setorId;
        }

        const veiculos = await Veiculo.findAll({
            where: condition,
            include: [
                { model: Setor, as: 'setor' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.send(veiculos);
    } catch (err) {
        res.status(500).send({ message: err.message || "Erro ao buscar veículos." });
    }
};

// =====================================================================
// 3. BUSCAR UM (DETALHES + SEGURANÇA)
// =====================================================================
exports.findOne = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    try {
        const usuario = await Usuario.findByPk(userId);
        
        if (!usuario) {
            return res.status(401).send({ message: "Usuário não encontrado. Faça login novamente." });
        }

        const veiculo = await Veiculo.findByPk(id, {
            include: [
                { model: db.setor, as: 'setor' }, 
                { model: db.manutencao, as: 'manutencoes' },
                { model: db.multa, as: 'multas' },
                { model: db.ipva, as: 'ipvaVeiculo' },
                { model: db.seguro, as: 'seguro' } 
                // ---------------------------------
            ]
        });

        if (!veiculo) {
            return res.status(404).send({ message: "Veículo não encontrado." });
        }

        if (!usuario.admin && veiculo.setorId !== usuario.setorId) {
            return res.status(403).send({ message: "Acesso negado a este veículo." });
        }

        res.send(veiculo);

    } catch (err) {
        console.error("ERRO NO FINDONE:", err); 
        res.status(500).send({ message: "Erro ao buscar veículo: " + err.message });
    }
};

// =====================================================================
// 4. ATUALIZAR
// =====================================================================
exports.update = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    try {
        const usuario = await Usuario.findByPk(userId);
        
        // SEGURANÇA: Adicionada aqui também
        if (!usuario) {
            return res.status(401).send({ message: "Usuário não encontrado. Faça login novamente." });
        }

        const veiculo = await Veiculo.findByPk(id);

        if (!veiculo) return res.status(404).send({ message: "Veículo não encontrado." });

        if (!usuario.admin && veiculo.setorId !== usuario.setorId) {
            return res.status(403).send({ message: "Acesso negado." });
        }

        await Veiculo.update(req.body, { where: { id: id } });
        res.send({ message: "Veículo atualizado com sucesso." });

    } catch (err) {
        res.status(500).send({ message: "Erro ao atualizar veículo." });
    }
};

// =====================================================================
// 5. EXCLUIR
// =====================================================================
exports.delete = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    try {
        const usuario = await Usuario.findByPk(userId);
        
        // SEGURANÇA: Adicionada aqui também
        if (!usuario) {
            return res.status(401).send({ message: "Usuário não encontrado. Faça login novamente." });
        }

        const veiculo = await Veiculo.findByPk(id);

        if (!veiculo) return res.status(404).send({ message: "Veículo não encontrado." });

        if (!usuario.admin && veiculo.setorId !== usuario.setorId) {
            return res.status(403).send({ message: "Acesso negado." });
        }

        await Veiculo.destroy({ where: { id: id } });
        res.send({ message: "Veículo excluído com sucesso!" });

    } catch (err) {
        res.status(500).send({ message: "Erro ao excluir veículo." });
    }
};