const db = require("../models");
const Transferencia = db.transferencia;
const Veiculo = db.veiculo;
// --- CORREÇÃO: IMPORTAR OS MODELOS QUE FALTAVAM ---
const Setor = db.setor; 
const Usuario = db.usuario;
// -------------------------------------------------
const sequelize = db.sequelize;

// ========================
// 1. CRIAR NOVA TRANSFERÊNCIA
// ========================
exports.create = async (req, res) => {
    try {
        const { veiculoId, setorOrigemId, setorDestinoId, motivo } = req.body;
        const usuarioSolicitanteId = req.userId; 

        if (!usuarioSolicitanteId) {
            return res.status(401).send({ 
                message: "Não foi possível identificar o usuário logado." 
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
            usuarioSolicitanteId: usuarioSolicitanteId, 
            status: "pendente"
        });

        return res.status(201).send(nova);
    } catch (err) {
        console.error("Erro no create de transferência:", err); 
        return res.status(500).send({
            message: "Erro ao criar transferência: " + err.message
        });
    }
};

// ========================
// 2. LISTAR TODAS (COM JOIN) - ONDE O ERRO ACONTECIA
// ========================
exports.findAll = (req, res) => {
    const status = req.query.status;
    var condition = status ? { status: status } : null;

    Transferencia.findAll({ 
        where: condition,
        // Agora 'Setor' e 'Usuario' e 'Veiculo' estão definidos!
        include: [
            { model: Veiculo, as: 'veiculo' },
            { model: Setor, as: 'setorOrigem' }, 
            { model: Setor, as: 'setorDestino' },
            { model: Usuario, as: 'solicitante' }
        ],
        order: [['createdAt', 'DESC']] 
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.error("Erro no findAll:", err); // Log para ajudar a ver o erro
        res.status(500).send({ message: err.message || "Erro ao buscar transferências." });
    });
};

// ========================
// 3. ATUALIZAR STATUS (APROVAR/REJEITAR)
// ========================
exports.updateStatus = async (req, res) => {
    const transferenciaId = req.params.id;
    const { status } = req.body; 
    const userId = req.userId; // ID de quem está clicando no botão

    if (status !== 'aprovado' && status !== 'rejeitado') {
        return res.status(400).send({ message: "Status inválido." });
    }

    // Inicia a transação
    const t = await sequelize.transaction();

    try {
        // 1. Busca quem está tentando aprovar
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            await t.rollback();
            return res.status(401).send({ message: "Usuário não identificado." });
        }

        // 2. Busca a transferência
        const transferencia = await Transferencia.findByPk(transferenciaId, { transaction: t });
        if (!transferencia) {
            await t.rollback(); 
            return res.status(404).send({ message: "Pedido não encontrado." });
        }

        // --- INÍCIO DA BLINDAGEM DE SEGURANÇA ---
        
        // Se o usuário NÃO for Admin, aplicamos as regras restritas
        if (!usuario.admin) {
            
            // Regra 1: Tem que ser Gestor
            if (!usuario.gestor) {
                await t.rollback();
                return res.status(403).send({ 
                    message: "Permissão negada: Apenas Gestores podem analisar transferências." 
                });
            }

            // Regra 2: Tem que ser o Gestor do Setor de DESTINO
            // (Só quem recebe o carro pode aceitar ficar com ele)
            if (usuario.setorId !== transferencia.setorDestinoId) {
                await t.rollback();
                return res.status(403).send({ 
                    message: "Permissão negada: Você só pode aprovar transferências destinadas ao seu setor." 
                });
            }
        }
        // --- FIM DA BLINDAGEM ---

        if (transferencia.status !== 'pendente') {
            await t.rollback();
            return res.status(400).send({ message: "Este pedido já foi finalizado." });
        }
        
        // Lógica de Atualização (igual a antes)
        if (status === 'aprovado') {
            await Veiculo.update(
                { setorId: transferencia.setorDestinoId }, 
                { where: { id: transferencia.veiculoId }, transaction: t }
            );
        }

        await transferencia.update(
            { 
                status: status,
                dataResolucao: new Date() 
            },
            { transaction: t }
        );

        await t.commit();
        res.send({ message: `Transferência ${status} com sucesso!` });

    } catch (err) {
        if (t) await t.rollback();
        res.status(500).send({ 
            message: "Erro ao processar: " + err.message 
        });
    }
};