import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from '@/styles/Lista.module.css';

export default function GestaoTransferenciasPage() {
    const [transferencias, setTransferencias] = useState([]);
    const [loading, setLoading] = useState(true);
    // Iniciamos como null para saber que ainda não carregou
    const [usuarioLogado, setUsuarioLogado] = useState(null); 

    // Busca usuário e transferências
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUsuarioLogado(JSON.parse(userStr));
        }
        fetchTransferencias();
    }, []);

    const fetchTransferencias = async () => {
        try {
            const response = await api.get('/transferencias');
            setTransferencias(response.data);
        } catch (err) {
            console.error("Erro:", err);
            alert("Erro ao carregar a lista.");
        } finally {
            setLoading(false);
        }
    };

    const handleProcessar = async (id, novoStatus) => {
        const confirmacao = confirm(`Tem certeza que deseja ${novoStatus.toUpperCase()} esta transferência?`);
        if (!confirmacao) return;

        try {
            await api.put(`/transferencias/${id}/status`, { status: novoStatus });
            alert(`Transferência ${novoStatus} com sucesso!`);
            fetchTransferencias();
        } catch (err) {
            alert("Erro: " + (err.response?.data?.message || err.message));
        }
    };

    const formatarData = (dataISO) => new Date(dataISO).toLocaleDateString('pt-BR');

    const getStatusClass = (status) => {
        if (status === 'aprovado') return { color: 'green', fontWeight: 'bold' };
        if (status === 'rejeitado') return { color: 'red', fontWeight: 'bold' };
        return { color: '#d97706', fontWeight: 'bold' };
    };

    // --- NOVA FUNÇÃO DE LÓGICA VISUAL ---
    const podeGerenciar = (transferencia) => {
        if (!usuarioLogado) return false; // Se não carregou o user, esconde

        // 1. Se for Admin, pode tudo
        if (usuarioLogado.admin) return true;

        // 2. Se não for Gestor, não pode nada
        if (!usuarioLogado.gestor) return false;

        // 3. Se for Gestor, SÓ pode se for do setor de DESTINO
        // (Quem recebe é que tem de aceitar)
        return usuarioLogado.setorId === transferencia.setorDestinoId;
    };
    // ------------------------------------

    if (loading) return <div className={styles.container}><h3>A carregar...</h3></div>;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Gestão de Transferências</h3>
            
            <div className={styles.div_tabela}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Veículo</th>
                            <th>Origem ➡ Destino</th>
                            <th>Solicitante</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transferencias.length > 0 ? (
                            transferencias.map((t) => (
                                <tr key={t.id}>
                                    <td>{formatarData(t.createdAt)}</td>
                                    <td>{t.veiculo?.modelo} <small>({t.veiculo?.placa})</small></td>
                                    <td>
                                        {t.setorOrigem?.nome} <br/> ⬇ <br/> <strong>{t.setorDestino?.nome}</strong>
                                    </td>
                                    <td>{t.solicitante?.nome}</td>
                                    <td style={getStatusClass(t.status)}>{t.status.toUpperCase()}</td>

                                    <td>
                                        {/* LÓGICA DE EXIBIÇÃO APLICADA AQUI */}
                                        {t.status === 'pendente' ? (
                                            
                                            podeGerenciar(t) ? (
                                                // SE TIVER PERMISSÃO: Mostra botões
                                                <div style={{display: 'flex', gap: '5px'}}>
                                                    <button 
                                                        className={styles.pageButton}
                                                        style={{backgroundColor: '#28a745', color: 'white', border: 'none'}}
                                                        onClick={() => handleProcessar(t.id, 'aprovado')}
                                                        title="Aprovar Transferência"
                                                    >
                                                        ✔
                                                    </button>
                                                    <button 
                                                        className={styles.pageButton}
                                                        style={{backgroundColor: '#dc3545', color: 'white', border: 'none'}}
                                                        onClick={() => handleProcessar(t.id, 'rejeitado')}
                                                        title="Rejeitar Transferência"
                                                    >
                                                        ✖
                                                    </button>
                                                </div>
                                            ) : (
                                                // SE NÃO TIVER PERMISSÃO: Mostra mensagem
                                                <span style={{fontSize: '0.8rem', color: '#999', fontStyle: 'italic'}}>
                                                    Aguardando Destino...
                                                </span>
                                            )

                                        ) : (
                                            // SE JÁ NÃO FOR PENDENTE
                                            <span>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Nenhuma transferência.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}