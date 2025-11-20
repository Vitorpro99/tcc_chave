import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca os dados resumidos do backend
        api.get('/dashboard/resumo')
            .then(res => {
                setDados(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar dashboard:", err);
                alert("Erro ao carregar dados do dashboard.");
                setLoading(false);
            });
    }, []);

    // Função para formatar dinheiro
    const formatarMoeda = (valor) => {
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (loading) {
        return (
            <>
                <div className={styles.container}>
                    <h3>Carregando indicadores...</h3>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Painel de Controle</h1>

                <div className={styles.grid}>
                    
                    {/* Card 1: Total de Veículos */}
                    <div className={`${styles.card} ${styles.cardBlue}`}>
                        <span className={styles.cardTitle}>Frota Ativa</span>
                        <span className={styles.cardValue}>
                            {dados?.totalVeiculos || 0}
                        </span>
                        <span className={styles.cardSub}>Veículos no seu setor</span>
                    </div>

                    {/* Card 2: Custo de Manutenção */}
                    <div className={`${styles.card} ${styles.cardGreen}`}>
                        <span className={styles.cardTitle}>Custo Manutenção</span>
                        <span className={styles.cardValue}>
                            {formatarMoeda(dados?.custoManutencao || 0)}
                        </span>
                        <span className={styles.cardSub}>Total acumulado</span>
                    </div>

                    {/* Card 3: Transferências Pendentes */}
                    <div className={`${styles.card} ${styles.cardOrange}`}>
                        <span className={styles.cardTitle}>Transferências</span>
                        <span className={styles.cardValue}>
                            {dados?.transferenciasPendentes || 0}
                        </span>
                        <span className={styles.cardSub}>Aguardando aprovação</span>
                    </div>

                </div>
            </div>
        </>
    );
}