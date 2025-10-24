import Image from 'next/image';
import api from '@/services/api'

import styles from './Modal.module.css'; // Usaremos um CSS module para o estilo

export default function ModalVeiculo({ veiculo, onClose }) {
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
        // O fundo escuro que cobre a tela
        <div className={styles.modalOverlay} onClick={onClose}>
            {/* A caixa de conteúdo do modal */}
            {/* Usamos e.stopPropagation() para evitar que o clique dentro do modal feche-o */}
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                
                {/* Botão para fechar no canto superior direito */}
                <button className={styles.closeButton} onClick={onClose}>
                    &times; {/* Isso é um 'X' */}
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
                    <p><strong>Setor:</strong> {veiculo.setorId || 'Não informada'}</p>

                    <td><button type="button" className={styles.editButton}  onClick={() => editarVeiculo(veiculo.id)}>Editar</button></td>
                    <td><button type="button" className={styles.deleteButton} onClick={() => excluirVeículo(veiculo.id)}>Excluir</button></td>
                    
                </div>
                
            </div>
        </div>
    );
}