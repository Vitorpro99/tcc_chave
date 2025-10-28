import Image from 'next/image';
import api from '@/services/api'
import router from 'next/router';
import styles from './Modal.module.css'; // Usaremos um CSS module para o estilo
import Link from 'next/link';

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


    if (!veiculo) return null; // Não renderiza nada se não houver veículo

    const excluirVeículo = (id) =>{
        if(confirm("Você deseja deletar o veículo?")){
            api
        .delete(`veiculos/${id}`)
        .then((res)=> {
            alert("Veículo excluido com sucesso")
            onClose();
            router.reload();}
    )
        .catch((err) => alert("Erro ao excluir"))
        }
        
        
    }
    const editarVeiculo = (id) =>{
        router.push(`/editar-veiculo/${id}`)
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
          
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                
                
                <button className={styles.closeButton} onClick={onClose}>
                    &times; 
                </button>

                <h2>Detalhes do Veículo</h2>
                <div className={styles.foto}>
                    <Image
                        src="/placa.png"
                        height={108}
                        width={192}
                    />
                </div>
                <div className={styles.detailsGrid}>
                    <p><strong>Marca:</strong> {veiculo.marca}</p>
                    <p><strong>Modelo:</strong> {veiculo.modelo}</p>
                    <p><strong>Placa:</strong> {veiculo.placa}</p>
                    <p><strong>Ano:</strong> {veiculo.ano}</p>
                    <p><strong>Cor:</strong> {veiculo.cor}</p>
                    <p><strong>Data:</strong> {veiculo.dataAquisicao || 'Não informado'}</p>
                    <p></p>
                    <p><strong>Setor:</strong> {veiculo.setor ? veiculo.setor.nome : 'Não informada'}</p>

                   <div className={styles.actionsContainer}>


                          

                
                </div>
                    
                </div>

                <div className={styles.manutencoesSection}>
                    
                    <h3>Histórico de Manutenções</h3>
                    {veiculo.manutencoes && veiculo.manutencoes.length > 0 ? (
                        <ul className={styles.manutencoesList}>
                            {/* Usamos .map() para criar um item de lista para cada manutenção */}
                            {veiculo.manutencoes.map((manutencao) => (
                                <li key={manutencao.id} className={styles.manutencaoItem}>
                                    <p><strong>Data:</strong> {formatarData(manutencao.data)}</p>
                                    <p><strong>Tipo:</strong> {manutencao.tipo}</p>
                                    <p><strong>Valor:</strong> {formatarValor(manutencao.valor)}</p>
                                    {manutencao.observacoes && <p><strong>Obs:</strong> {manutencao.observacoes}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        
                        <p className={styles.noRecords}>Nenhum registro de manutenção encontrado.</p>
                    )}
                </div>
                <div className={styles.buttonsContainer}>
                    <Link className={styles.repairButton} href={`/cadastrar_manutencao/${veiculo.id}`}>
                        Adicionar Manutenção
                    </Link>
                    <button type="button" className={styles.editButton} onClick={() => editarVeiculo(veiculo.id)}>Editar Veículo</button>
                    <button type="button" className={styles.deleteButton} onClick={() => excluirVeículo(veiculo.id)}>Excluir Veículo</button>
                </div>
            </div>
        </div>
    );
}