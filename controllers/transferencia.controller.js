const db = require("../models");
const Transferencia = db.transferencia;
const Veiculo = db.veiculo;
const sequelize = db.sequelize;



// ========================
// 1. CRIAR NOVA TRANSFERÊNCIA
// ========================
exports.create = async (req, res) => {
    try {
        const { veiculoId, setorOrigemId, setorDestinoId, motivo } = req.body;
        const solicitanteId = req.userId; // vem do token

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
            solicitanteId,
            status: "pendente",
            dataSolicitacao: new Date()
        });

        return res.status(201).send(nova);
    } catch (err) {
        return res.status(500).send({
            message: "Erro ao criar transferência: " + err.message
        });
    }
};

// ========================
// 2. LISTAR TODAS AS TRANSFERÊNCIAS
// ========================
exports.findAll = async (req, res) => {
    try {
        const transferencias = await Transferencia.findAll({
            include: [
                { model: Veiculo, as: "veiculo" }
            ],
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).send(transferencias);
    } catch (err) {
        return res.status(500).send({
            message: "Erro ao listar transferências: " + err.message
        });
    }
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
