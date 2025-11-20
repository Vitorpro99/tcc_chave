const db = require("../models");
const Manutencao = db.manutencao;
const Veiculo = db.veiculo;
const Usuario = db.usuario;
const Op = db.Sequelize.Op; 

exports.getRelatorioManutencao = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;
        const userId = req.userId;

   
        const usuario = await Usuario.findByPk(userId);
        let filtroSetor = {};
        
        if (!usuario.admin) {
          
            filtroSetor = { setorId: usuario.setorId };
        }

        // 2. Construir o filtro de Data
        let filtroData = {};
        if (dataInicio && dataFim) {
            filtroData.data = {
                [Op.between]: [dataInicio, dataFim] 
            };
        }

        // 3. A Busca Complexa
        const relatorio = await Manutencao.findAll({
            where: filtroData, 
            include: [{
                model: Veiculo,
                as: 'veiculo',
                where: filtroSetor, 
                include: [db.setor] 
            }],
            order: [['data', 'DESC']] 
        });

        res.send(relatorio);

    } catch (err) {
        console.error("Erro no relatório:", err);
        res.status(500).send({ message: "Erro ao gerar relatório." });
    }
};