import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';
import styles from '@/styles/Profile.module.css';
import Link from 'next/link';

export default function VeiculoPerfilPage() {
    const router = useRouter();
    const { id } = router.query;

    const [veiculo, setVeiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('manutencao');

    useEffect(() => {
        if (id) {
            api.get(`/veiculos/${id}`)
                .then(res => {
                    setVeiculo(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    // Se der erro 403 ou 404, volta para a lista
                    alert(err.response?.data?.message || "Erro ao carregar veículo.");
                    router.push('/listaVeiculos');
                });
        }
    }, [id]);

    if (loading) return <div className={styles.container}><h3>Carregando prontuário...</h3></div>;

    const fmtData = (d) => new Date(d).toLocaleDateString('pt-BR');
    const fmtValor = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className={styles.container}>
            
            {/* COLUNA ESQUERDA: RESUMO */}
            <aside className={styles.summaryCard}>
                <div className={styles.avatar}></div>
                <h1 className={styles.carTitle}>{veiculo.marca} {veiculo.modelo}</h1>
                <span className={styles.carPlate}>{veiculo.placa}</span>

                <div className={styles.infoList}>
                    <div className={styles.infoItem}><strong>Ano:</strong> {veiculo.ano}</div>
                    <div className={styles.infoItem}><strong>Cor:</strong> {veiculo.cor}</div>
                    <div className={styles.infoItem}><strong>Setor:</strong> {veiculo.setor?.nome || 'N/A'}</div>
                    <div className={styles.infoItem}><strong>Aquisição:</strong> {fmtData(veiculo.dataAquisicao)}</div>
                </div>

                <div className={`${styles.actionButtons} no-print`}>
                    <button onClick={() => window.print()} className={`${styles.btn} ${styles.btnPrint}`}>
                        🖨️ Imprimir Prontuário
                    </button>
                    
                    {/* --- CORREÇÃO AQUI --- */}
                    <Link href="/listaVeiculos" className={`${styles.btn} ${styles.btnBack}`}>
                        Voltar à Lista
                    </Link>
                    {/* --------------------- */}
                </div>
            </aside>

            {/* COLUNA DIREITA: DETALHES */}
            <main className={styles.contentArea}>
                
                {/* NAVEGAÇÃO DE ABAS */}
                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'manutencao' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('manutencao')}
                    >
                        🛠️ Manutenções ({veiculo.manutencoes?.length || 0})
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'multas' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('multas')}
                    >
                        ⚠️ Multas ({veiculo.multas?.length || 0})
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'docs' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('docs')}
                    >
                        📄 Documentos
                    </button>
                </div>

                {/* CONTEÚDO DAS ABAS */}
                
                {/* ABA 1: MANUTENÇÃO */}
                <div className={styles.tabContent} style={{display: activeTab === 'manutencao' ? 'block' : 'none'}}>
                    <h2 className={styles.tabTitlePrint}>Histórico de Manutenções</h2>
                    <table className={styles.miniTable}>
                        <thead>
                            <tr><th>Data</th><th>Serviço</th><th>Valor</th></tr>
                        </thead>
                        <tbody>
                            {veiculo.manutencoes?.map(m => (
                                <tr key={m.id}>
                                    <td>{fmtData(m.data)}</td>
                                    <td>{m.tipo} <br/><small>{m.observacoes}</small></td>
                                    <td>{fmtValor(m.valor)}</td>
                                </tr>
                            ))}
                            {(!veiculo.manutencoes || veiculo.manutencoes.length === 0) && <tr><td colSpan="3">Nenhum registro.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* ABA 2: MULTAS */}
                <div className={styles.tabContent} style={{display: activeTab === 'multas' ? 'block' : 'none'}}>
                    <h2 className={styles.tabTitlePrint}>Histórico de Infrações</h2>
                    <table className={styles.miniTable}>
                        <thead>
                            <tr><th>Data</th><th>Descrição</th><th>Valor</th></tr>
                        </thead>
                        <tbody>
                            {veiculo.multas?.map(m => (
                                <tr key={m.id}>
                                    <td>{fmtData(m.data)}</td>
                                    <td>{m.descricao}</td>
                                    <td>{fmtValor(m.valor)}</td>
                                </tr>
                            ))}
                            {(!veiculo.multas || veiculo.multas.length === 0) && <tr><td colSpan="3">Nenhuma multa.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* ABA 3: DOCUMENTOS (IPVA/Seguro) */}
                <div className={styles.tabContent} style={{display: activeTab === 'docs' ? 'block' : 'none'}}>
                    <h2 className={styles.tabTitlePrint}>Documentação e Seguros</h2>
                    
                    <h3>IPVA</h3>
                    <table className={styles.miniTable} style={{marginBottom: '2rem'}}>
                        <thead><tr><th>Ano</th><th>Descrição</th><th>Valor</th></tr></thead>
                        <tbody>
                            {veiculo.ipvaVeiculo?.map(i => (
                                <tr key={i.id}>
                                    <td>{i.ano}</td>
                                    <td>{i.descricao}</td>
                                    <td>{fmtValor(i.valor)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Seguro</h3>
                    {veiculo.seguro ? (
                        <div style={{background: '#f9f9f9', padding: '1rem', borderRadius: '5px'}}>
                            <p><strong>Apólice:</strong> {veiculo.seguro.numeroApolice}</p>
                            <p><strong>Seguradora/Tipo:</strong> {veiculo.seguro.tipoSeguro}</p>
                            <p><strong>Franquia:</strong> {fmtValor(veiculo.seguro.franquia)}</p>
                            <p><strong>Vigência:</strong> {fmtData(veiculo.seguro.dataInicio)} até {fmtData(veiculo.seguro.dataFim)}</p>
                        </div>
                    ) : (
                        <p>Sem seguro cadastrado.</p>
                    )}
                </div>

            </main>
        </div>
    );
}