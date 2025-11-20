import { useState, useEffect } from 'react';
import api from '@/services/api';
import Header from '@/components/header';
import formStyles from '@/styles/form.module.css'; 
import listStyles from '@/styles/Lista.module.css';
import { useRouter } from 'next/router';

export default function RelatoriosPage() {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscou, setBuscou] = useState(false);
    
    // NOVO: Estado para guardar quem está gerando o relatório
    const [usuarioLogado, setUsuarioLogado] = useState({ nome: 'Desconhecido', setorId: null });

    useEffect(() => {
        // Busca os dados do usuário no localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUsuarioLogado(JSON.parse(userStr));
        }
    }, []);

    const handleBuscar = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/relatorios/manutencoes`, {
                params: { dataInicio, dataFim }
            });
            setResultados(response.data);
            setBuscou(true);
        } catch (err) {
            alert("Erro ao buscar dados.");
            console.error(err);
        }
    };

    const handleImprimir = () => {
        window.print(); 
    };

    const calcularTotal = () => {
        return resultados.reduce((acc, item) => acc + item.valor, 0);
    };

    // Formata data para exibir bonito (DD/MM/AAAA)
    const formatarDataDisplay = (dataISO) => {
        if (!dataISO) return '...';
        return new Date(dataISO).toLocaleDateString('pt-BR');
    }

    return (
        <>
            <div className="no-print"> 
                <Header />
            </div>

            <div className={listStyles.container}>
                {/* --- INÍCIO DO CABEÇALHO DE IMPRESSÃO (Invisível na tela) --- */}
                <div className="print-only header-relatorio">
                    <div style={{borderBottom: '2px solid #C42020', paddingBottom: '10px', marginBottom: '20px'}}>
                        <h1 style={{margin: 0, color: '#333'}}>Relatóriode Manutenções</h1>
                        <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#666'}}>
                            Sistema de Gestão de Frotas
                        </p>
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px'}}>
                        <div>
                            <p><strong>Gerado por:</strong> {usuarioLogado.nome}</p>
                            <p><strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <p><strong>Período Analisado:</strong></p>
                            <p>{formatarDataDisplay(dataInicio)} até {formatarDataDisplay(dataFim)}</p>
                        </div>
                    </div>
                </div>
                {/* --- FIM DO CABEÇALHO DE IMPRESSÃO --- */}

                <h1 className={`${listStyles.title} no-print`}>Relatório de Manutenções</h1>

                {/* Filtros (Escondidos na impressão) */}
                <div className={`${formStyles.formDiv} no-print`} style={{maxWidth: '100%', marginBottom: '2rem'}}>
                    <form onSubmit={handleBuscar} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end'}}>
                        <div style={{flex: 1}}>
                            <label className={formStyles.label}>Data Início</label>
                            <input className={formStyles.input} type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </div>
                        <div style={{flex: 1}}>
                            <label className={formStyles.label}>Data Fim</label>
                            <input className={formStyles.input} type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                        </div>
                        <button type="submit" className={formStyles.mainButton} style={{width: 'auto', marginBottom: '15px'}}>Buscar</button>
                    </form>
                </div>

                {/* Tabela */}
                {buscou && (
                    <div className={listStyles.div_tabela}>
                        <div className="no-print" style={{marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3>Resultados encontrados: {resultados.length}</h3>
                            <button onClick={handleImprimir} className={formStyles.mainButton} style={{width: 'auto', backgroundColor: '#666'}}>
                                🖨️ Imprimir / PDF
                            </button>
                        </div>

                        <table className={listStyles.table}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Veículo</th>
                                    <th>Tipo</th>
                                    <th>Setor</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((item) => (
                                    <tr key={item.id}>
                                        <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                                        <td>{item.veiculo?.modelo} <small>({item.veiculo?.placa})</small></td>
                                        <td>{item.tipo}</td>
                                        <td>{item.veiculo?.setor?.nome}</td>
                                        <td>{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{backgroundColor: '#eee', fontWeight: 'bold'}}>
                                    <td colSpan="4" style={{textAlign: 'right', padding: '1rem'}}>TOTAL DO PERÍODO:</td>
                                    <td style={{padding: '1rem', color: '#C42020'}}>
                                        {calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        
                        {/* Rodapé de impressão */}
                        <div className="print-only" style={{marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '10px', textAlign: 'center', fontSize: '0.8rem', color: '#999'}}>
                            <p>Este documento foi gerado eletronicamente pelo Sistema de Gestão de Frotas.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS Global para controlar a impressão */}
            <style jsx global>{`
                /* Estado normal na tela: esconde coisas de impressão */
                .print-only {
                    display: none !important;
                }

                /* Estado QUANDO FOR IMPRIMIR */
                @media print {
                    /* Esconde o que não interessa no papel */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Mostra o nosso cabeçalho personalizado */
                    .print-only {
                        display: block !important;
                    }

                    /* Ajustes para o papel ficar bonito */
                    body {
                        background-color: white;
                        font-size: 12pt;
                    }
                    
                    /* Remove sombras e bordas dos containers principais */
                    .${listStyles.container} {
                        padding: 0;
                        margin: 0;
                        box-shadow: none;
                    }
                    
                    /* Garante que a tabela use a largura total */
                    table {
                        width: 100% !important;
                    }
                    
                    /* Configurações da página (A4) */
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                }
            `}</style>
        </>
    );
}