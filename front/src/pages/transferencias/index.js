import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from '@/styles/Lista.module.css'; // Reutilizando o estilo da lista de veículos

export default function GestaoTransferenciasPage() {
    const [transferencias, setTransferencias] = useState([]);
    const [loading, setLoading] = useState(true);

    
    const fetchTransferencias = async () => {
        try {
            const response = await api.get('/transferencias');
            setTransferencias(response.data);
        } catch (err) {
            console.error("Erro ao buscar transferências:", err);
            alert("Erro ao carregar a lista de transferências.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransferencias();
    }, []);

    
    const handleProcessar = async (id, novoStatus) => {
        const confirmacao = confirm(`Tem certeza que deseja ${novoStatus.toUpperCase()} esta transferência?`);
        if (!confirmacao) return;

        try {
            await api.put(`/transferencias/${id}/status`, { status: novoStatus });
            alert(`Transferência ${novoStatus} com sucesso!`);
            fetchTransferencias(); 
        } catch (err) {
            console.error("Erro ao processar:", err);
            alert("Erro ao processar a solicitação: " + (err.response?.data?.message || err.message));
        }
    };

    // Função auxiliar para formatar data
    const formatarData = (dataISO) => {
        return new Date(dataISO).toLocaleDateString('pt-BR');
    };

    // Função para dar cor ao status (UX melhorada)
    const getStatusClass = (status) => {
        if (status === 'aprovado') return { color: 'green', fontWeight: 'bold' };
        if (status === 'rejeitado') return { color: 'red', fontWeight: 'bold' };
        return { color: '#d97706', fontWeight: 'bold' }; // Laranja para pendente
    };

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
                            <th>Motivo</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transferencias.length > 0 ? (
                            transferencias.map((t) => (
                                <tr key={t.id}>
                                    <td>{formatarData(t.createdAt)}</td>
                                    
                                    <td>
                                        {t.veiculo?.marca} {t.veiculo?.modelo} <br/>
                                        <small>({t.veiculo?.placa})</small>
                                    </td>

                                    <td>
                                        {t.setorOrigem?.nome} <br/>
                                        ⬇ <br/>
                                        <strong>{t.setorDestino?.nome}</strong>
                                    </td>

                                    <td>{t.solicitante?.nome || "Desconhecido"}</td>
                                    
                                    <td style={{maxWidth: '200px', fontSize: '0.9rem'}}>
                                        {t.motivo}
                                    </td>

                                    <td style={getStatusClass(t.status)}>
                                        {t.status.toUpperCase()}
                                    </td>

                                    <td>
                                        {t.status === 'pendente' ? (
                                            <div style={{display: 'flex', gap: '5px'}}>
                                                <button 
                                                    className={styles.pageButton} 
                                                    style={{backgroundColor: '#28a745', color: 'white', border: 'none'}}
                                                    onClick={() => handleProcessar(t.id, 'aprovado')}
                                                >
                                                    ✔
                                                </button>
                                                <button 
                                                    className={styles.pageButton}
                                                    style={{backgroundColor: '#dc3545', color: 'white', border: 'none'}}
                                                    onClick={() => handleProcessar(t.id, 'rejeitado')}
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>
                                    Nenhuma solicitação de transferência encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}