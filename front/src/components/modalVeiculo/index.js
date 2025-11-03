import Image from 'next/image';
import api from '@/services/api';
import router from 'next/router';
import styles from './Modal.module.css';
import Link from 'next/link';
import ListaMultas from '../ListaMultas';
import ListaIpva from '../listaIpva';

export default function ModalVeiculo({ veiculo, onClose }) {

    console.log("Objeto Veículo recebido no modal:", veiculo);

    const formatarData = (dataString) => {
        if (!dataString) return 'Data não informada';
        const data = new Date(dataString);
        data.setDate(data.getDate() + 1);
        return data.toLocaleDateString('pt-BR');
    };

    const formatarValor = (valor) => {
        if (typeof valor !== 'number') return 'Valor não informado';
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (!veiculo) return null;

    const excluirVeículo = (id) => {
        if (confirm("Você deseja deletar o veículo?")) {
            api.delete(`veiculos/${id}`)
                .then((res) => {
                    alert("Veículo excluido com sucesso");
                    onClose();
                    router.reload();
                })
                .catch((err) => alert("Erro ao excluir"));
        }
    };

    const editarVeiculo = (id) => {
        router.push(`/editar-veiculo/${id}`);
    };

    const excluirManutencao = (id) => {
        if (confirm("Você deseja deletar este item de manutenção?")) {
            api.delete(`manutencoes/${id}`)
                .then((res) => {
                    alert("Item deletado com sucesso");
                    router.reload();
                })
                .catch((err) => alert("Erro ao excluir"));
        }
    };
    const excluirMulta = (id) => {
        if (confirm("Você deseja deletar esta multa?")) {
            api.delete(`/multas/${id}`)
                .then((res) => {
                    alert("Multa deletada com sucesso");
                    router.reload();
                })
                .catch((err) => alert("Erro ao excluir a multa"));
        }
    };
    const excluirIpva = (id) => {
        if (confirm("Você deseja deletar este registro de IPVA?")) {
            api.delete(`/ipvas/${id}`)
                .then((res) => {
                    alert("IPVA deletado com sucesso");
                    router.reload();
                })
                .catch((err) => alert("Erro ao excluir o IPVA"));
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <h2>Detalhes do Veículo</h2>
                <div className={styles.modalBodyColumns}>

                    {/* Coluna Principal (Esquerda) */}
                    <div className={styles.mainColumn}>
                        <div className={styles.detailsGrid}>
                            <p><strong>Marca:</strong> {veiculo.marca}</p>
                            <p><strong>Modelo:</strong> {veiculo.modelo}</p>
                            <p><strong>Placa:</strong> {veiculo.placa}</p>
                            <p><strong>Ano:</strong> {veiculo.ano}</p>
                            <p><strong>Setor:</strong> {veiculo.setor ? veiculo.setor.nome : 'Não informada'}</p>
                        </div>
                        
                        <div className={styles.manutencoesSection}>
                            <h3>Histórico de Manutenções</h3>
                            {veiculo.manutencoes && veiculo.manutencoes.length > 0 ? (
                                <ul className={styles.manutencoesList}>
                                    {veiculo.manutencoes.map((manutencao) => (
                                        <li key={manutencao.id} className={styles.manutencaoItem}>
                                            <p><strong>Data:</strong> {formatarData(manutencao.data)}</p>
                                            <p><strong>Tipo:</strong> {manutencao.tipo}</p>
                                            <p><strong>Valor:</strong> {formatarValor(manutencao.valor)}</p>
                                            {manutencao.observacoes && <p><strong>Obs:</strong> {manutencao.observacoes}</p>}
                                           
                                            <button type="button" className={styles.deleteButtonSmall} onClick={() => excluirManutencao(manutencao.id)}>Excluir</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noRecords}>Nenhum registro de manutenção encontrado.</p>
                            )}
                        </div>
                    </div>

                    {/* Coluna Lateral (Direita) */}
                    <div className={styles.sideColumn}>
                        <ListaMultas     
                            multas={veiculo.multas}
                            formatarData={formatarData}
                            formatarValor={formatarValor}
                            onExcluir={excluirMulta}
                        />

                        <ListaIpva 
                            ipvaList={veiculo.ipvaVeiculo}
                            formatarValor={formatarValor}
                            onExcluir={excluirIpva}
                        />
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <Link className={styles.editButton} href={`/cadastrar_manutencao/${veiculo.id}`}>Adicionar Manutenção</Link>
                    <Link className={styles.editButton} href={`/cadastro-multa/${veiculo.id}`}>Adicionar Multa</Link>
                    <Link className={styles.editButton} href={`/cadastro-ipva/${veiculo.id}`}>Adicionar IPVA </Link>
                    <button type="button" className={styles.editButton} onClick={() => editarVeiculo(veiculo.id)}>Editar Veículo</button>
                    <button type="button" className={styles.deleteButton} onClick={() => excluirVeículo(veiculo.id)}>Excluir Veículo</button>
                </div>
            </div>
        </div>
    );
}