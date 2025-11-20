const db = require("../models");
const Veiculo = db.veiculo;
const Manutencao = db.manutencao;
const Transferencia = db.transferencia;
const Usuario = db.usuario;
const Op = db.Sequelize.Op;

exports.getResumo = async (req, res) => {
    try {
        // 1. Descobrir quem é o usuário e qual o seu setor
        const usuario = await Usuario.findByPk(req.userId);
        
        if (!usuario) {
            return res.status(404).send({ message: "Usuário não encontrado." });
        }

        // 2. Definir o filtro de setor
        let filtroSetor = {}; 
        if (!usuario.admin) {
            filtroSetor = { setorId: usuario.setorId };
        }

        console.log("========================================");
        console.log("USUÁRIO:", usuario.nome);
        console.log("É ADMIN?:", usuario.admin);
        console.log("ID DO SETOR DO USUÁRIO:", usuario.setorId);
        console.log("FILTRO APLICADO:", filtroSetor);
        console.log("========================================");

        // --- MUDANÇA LÓGICA PARA CORRIGIR O ERRO DO POSTGRES ---

        // Passo A: Buscar primeiro os veículos (precisamos dos IDs para somar a manutenção)
        const listaVeiculos = await Veiculo.findAll({
            where: filtroSetor,
            attributes: ['id'] // Só precisamos do ID, fica mais leve
        });

        // Extraímos apenas os números dos IDs num array (ex: [1, 5, 8])
        const idsVeiculos = listaVeiculos.map(v => v.id);
        const totalVeiculos = listaVeiculos.length;

        // Passo B: Buscar as outras estatísticas em paralelo
        const [totalManutencoes, transferenciasPendentes] = await Promise.all([
            
            // Soma o custo total das manutenções
            // SE existirem veículos, soma onde veiculoId está na lista de IDs
            // SE NÃO existirem veículos, o custo é 0 (evita erro de SQL)
            idsVeiculos.length > 0 ? Manutencao.sum('valor', { 
                where: {
                    veiculoId: idsVeiculos 
                }
            }) : 0,

            // Conta transferências pendentes
            Transferencia.count({
                where: { 
                    status: 'pendente',
                    [Op.or]: [
                        { setorOrigemId: usuario.setorId },
                        { setorDestinoId: usuario.setorId }
                    ]
                }
            })
        ]);

        // 4. Envia o resumo
        res.send({
            totalVeiculos: totalVeiculos || 0,
            custoManutencao: totalManutencoes || 0,
            transferenciasPendentes: transferenciasPendentes || 0
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Erro ao gerar dashboard: " + err.message });
    }
};