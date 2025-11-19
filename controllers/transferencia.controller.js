const db = require("../models");
const Transferencia = db.transferencia;
const Veiculo = db.veiculo;
const sequelize = db.sequelize;



exports.create = async (req, res) => {
    try {
        const { veiculoId, setorOrigemId, setorDestinoId, motivo } = req.body;
        
        // CORREÇÃO 1: Pegamos o ID do token
        const usuarioSolicitanteId = req.userId; 

        // CORREÇÃO 2: Verificação de segurança extra
        // Se o token falhou ou não tinha ID, paramos aqui.
        if (!usuarioSolicitanteId) {
            return res.status(401).send({ 
                message: "Não foi possível identificar o usuário logado (Token inválido ou sem ID)." 
            });
        }

        if (!veiculoId || !setorOrigemId || !setorDestinoId || !motivo) {
            return res.status(400).send({
                message: "Campos obrigatórios: veiculoId, setorOrigemId, setorDestinoId, motivo."
            });
        }

        const nova = await Transferencia.create({
            veiculoId,
            setorOrigemId,
            setorDestinoId,
            motivo,
            // CORREÇÃO 3: Usamos o nome exato que está no Modelo
            usuarioSolicitanteId: usuarioSolicitanteId, 
            status: "pendente"
            // Nota: Não precisamos de 'dataSolicitacao', o Sequelize usa 'createdAt' automaticamente
        });

        return res.status(201).send(nova);
    } catch (err) {
        console.error("Erro no create de transferência:", err); // Log no terminal ajuda muito
        return res.status(500).send({
            message: "Erro ao criar transferência: " + err.message
        });
    }
};
// ========================
// 2. LISTAR TODAS AS TRANSFERÊNCIAS
// ========================
exports.findAll = (req, res) => {
    // Se quisermos filtrar (ex: mostrar só as pendentes)
    const status = req.query.status;
    var condition = status ? { status: status } : null;

    Transferencia.findAll({ 
        where: condition,
        // AQUI ESTÁ A MÁGICA: Trazemos os dados das outras tabelas
        include: [
            { model: db.veiculo, as: 'veiculo' }, 
            { model: db.setor, as: 'setorOrigem' }, 
            { model: db.setor, as: 'setorDestino' },
            { model: db.usuario, as: 'solicitante' }
        ],
        order: [['createdAt', 'DESC']] // As mais recentes primeiro
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Erro ao buscar transferências." });
    });
};

// ========================
// 3. ATUALIZAR STATUS (APROVAR / REJEITAR)
// ========================
exports.updateStatus = async (req, res) => {
    
    const transferenciaId = req.params.id; // <-- corrigido (antes estava "aid")
    const { status } = req.body;
    const gestorId = req.userId; // gestor que está aprovando

    if (status !== "aprovado" && status !== "rejeitado") {
        return res.status(400).send({
            message: "Status inválido. Use 'aprovado' ou 'rejeitado'."
        });
    }

    const t = await sequelize.transaction();

    try {
        const transferencia = await Transferencia.findByPk(transferenciaId, { transaction: t });

        if (!transferencia) {
            await t.rollback();
            return res.status(404).send({ message: "Transferência não encontrada." });
        }

        if (transferencia.status !== "pendente") {
            await t.rollback();
            return res.status(400).send({
                message: "Este pedido já foi finalizado."
            });
        }

        // Se aprovado → atualizar veículo
        if (status === "aprovado") {
            await Veiculo.update(
                { setorId: transferencia.setorDestinoId },
                { where: { id: transferencia.veiculoId }, transaction: t }
            );
        }

        // Atualiza transferência
        await transferencia.update(
            {
                status,
                gestorIdResolucao: gestorId,
                dataResolucao: new Date()
            },
            { transaction: t }
        );

        await t.commit();

        return res.send({
            message: `Transferência ${status} com sucesso!`
        });
    } catch (err) {
        await t.rollback();
        return res.status(500).send({
            message: "Erro ao processar a transferência: " + err.message
        });
    }
};
