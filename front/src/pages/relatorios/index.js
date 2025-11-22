import { useState, useEffect } from 'react';
import api from '@/services/api';
import Header from '@/components/header'; // Verifique se é Header com H maiúsculo
import formStyles from '@/styles/form.module.css'; 
import listStyles from '@/styles/Lista.module.css';
import { useRouter } from 'next/router';

export default function RelatoriosPage() {
    const [tipoRelatorio, setTipoRelatorio] = useState('manutencao');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscou, setBuscou] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState({ nome: 'Desconhecido', setorId: null });
    
    // 1. NOVO ESTADO PARA A DATA (Começa null para não dar erro de hidratação)
    const [dataEmissao, setDataEmissao] = useState(null);

    useEffect(() => {
        // Busca usuário
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUsuarioLogado(JSON.parse(userStr));
        }

        // 2. DEFINE A DATA APENAS NO LADO DO CLIENTE
        setDataEmissao(new Date());
    }, []);

    const handleBuscar = async (e) => {
        e.preventDefault();
        setResultados([]); 
        
        try {
            const endpoint = tipoRelatorio === 'manutencao' 
                ? '/relatorios/manutencoes' 
                : '/relatorios/multas';

            const response = await api.get(endpoint, {
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
                <div className="print-only header-relatorio">
                    <div style={{borderBottom: '2px solid #C42020', paddingBottom: '10px', marginBottom: '20px'}}>
                        <h1 style={{margin: 0, color: '#333'}}>
                            Relatório de {tipoRelatorio === 'manutencao' ? 'Manutenções' : 'Multas e Infrações'}
                        </h1>
                        <p style={{margin: '5px 0', fontSize: '0.9rem', color: '#666'}}>
                            Sistema de Gestão de Frotas
                        </p>
                    </div>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px'}}>
                        <div>
                            <p><strong>Gerado por:</strong> {usuarioLogado.nome}</p>
                            
                            {/* 3. USO SEGURO DA DATA (Só renderiza se dataEmissao existir) */}
                            <p><strong>Data de Emissão:</strong> {dataEmissao ? `${dataEmissao.toLocaleDateString('pt-BR')} às ${dataEmissao.toLocaleTimeString('pt-BR')}` : '...'}</p>
                        
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <p><strong>Período Analisado:</strong></p>
                            <p>{formatarDataDisplay(dataInicio)} até {formatarDataDisplay(dataFim)}</p>
                        </div>
                    </div>
                </div>

                <h1 className={`${listStyles.title} no-print`}>Central de Relatórios</h1>

                <div className={`${formStyles.formDiv} no-print`} style={{maxWidth: '100%', marginBottom: '2rem'}}>
                    <form onSubmit={handleBuscar} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                        
                        <div style={{flex: 1, minWidth: '200px'}}>
                            <label className={formStyles.label}>Tipo de Relatório</label>
                            <select 
                                className={formStyles.input}
                                value={tipoRelatorio}
                                onChange={(e) => {
                                    setTipoRelatorio(e.target.value);
                                    setBuscou(false);
                                    setResultados([]);
                                }}
                            >
                                <option value="manutencao">💰 Custos de Manutenção</option>
                                <option value="multa">⚠️ Infrações e Multas</option>
                            </select>
                        </div>

                        <div style={{flex: 1}}>
                            <label className={formStyles.label}>Data Início</label>
                            <input className={formStyles.input} type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </div>
                        <div style={{flex: 1}}>
                            <label className={formStyles.label}>Data Fim</label>
                            <input className={formStyles.input} type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                        </div>
                        <button type="submit" className={formStyles.mainButton} style={{width: 'auto', marginBottom: '15px'}}>Gerar Relatório</button>
                    </form>
                </div>

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
                                    <th>{tipoRelatorio === 'manutencao' ? 'Serviço' : 'Infração'}</th>
                                    <th>Setor</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((item) => (
                                    <tr key={item.id}>
                                        <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                                        <td>{item.veiculo?.modelo} <small>({item.veiculo?.placa})</small></td>
                                        <td>{tipoRelatorio === 'manutencao' ? item.tipo : item.descricao}</td>
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
                        
                        <div className="print-only" style={{marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '10px', textAlign: 'center', fontSize: '0.8rem', color: '#999'}}>
                            <p>Este documento foi gerado eletronicamente pelo Sistema de Gestão de Frotas.</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .print-only { display: none !important; }
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background-color: white; font-size: 12pt; }
                    .${listStyles.container} { padding: 0; margin: 0; box-shadow: none; }
                    table { width: 100% !important; }
                    @page { size: A4; margin: 2cm; }
                }
            `}</style>
        </>
    );
}