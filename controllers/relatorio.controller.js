const db = require("../models");
const Manutencao = db.manutencao;
const Multa = db.multa;    
const Veiculo = db.veiculo;
const Usuario = db.usuario;
const Setor = db.setor;    
const Op = db.Sequelize.Op;

// ==========================================
// 1. RELATÓRIO DE MANUTENÇÕES
// ==========================================
exports.getRelatorioManutencao = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query; 
        const userId = req.userId; 

        // 1. Descobrir o setor do usuário
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            return res.status(404).send({ message: "Usuário não encontrado." });
        }

        let filtroSetor = {};
        if (!usuario.admin) {
            filtroSetor = { setorId: usuario.setorId };
        }

        // 2. Filtro de Data
        let filtroData = {};
        if (dataInicio && dataFim) {
            filtroData.data = {
                [Op.between]: [dataInicio, dataFim] 
            };
        }

        // 3. Busca
        const relatorio = await Manutencao.findAll({
            where: filtroData, 
            include: [{
                model: Veiculo,
                as: 'veiculo',
                where: filtroSetor, // Filtra veículos pelo setor do usuário
                include: [{ model: Setor, as: 'setor' }] // Traz o nome do setor
            }],
            order: [['data', 'DESC']] 
        });

        res.send(relatorio);

    } catch (err) {
        console.error("Erro no relatório de manutenção:", err);
        res.status(500).send({ message: "Erro ao gerar relatório: " + err.message });
    }
};

// ==========================================
// 2. RELATÓRIO DE MULTAS
// ==========================================
exports.getRelatorioMultas = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;
        const userId = req.userId;

        // 1. Descobrir o setor do usuário
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            return res.status(404).send({ message: "Usuário não encontrado." });
        }

        let filtroSetor = {};
        if (!usuario.admin) {
            filtroSetor = { setorId: usuario.setorId };
        }

        // 2. Filtro de Data
        let filtroData = {};
        if (dataInicio && dataFim) {
            filtroData.data = {
                [Op.between]: [dataInicio, dataFim]
            };
        }

        // 3. Busca
        const relatorio = await Multa.findAll({
            where: filtroData,
            include: [{
                model: Veiculo,
                as: 'veiculo',
                where: filtroSetor,
                include: [{ model: Setor, as: 'setor' }]
            }],
            order: [['data', 'DESC']]
        });

        res.send(relatorio);

    } catch (err) {
        console.error("Erro no relatório de multas:", err);
        res.status(500).send({ message: "Erro ao gerar relatório: " + err.message });
    }
};