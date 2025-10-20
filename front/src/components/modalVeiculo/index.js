// components/ModalVeiculo.js

import styles from './Modal.module.css'; // Usaremos um CSS module para o estilo

export default function ModalVeiculo({ veiculo, onClose }) {
    if (!veiculo) return null; // Não renderiza nada se não houver veículo

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

                <div className={styles.detailsGrid}>
                    <p><strong>Marca:</strong> {veiculo.marca}</p>
                    <p><strong>Modelo:</strong> {veiculo.modelo}</p>
                    <p><strong>Placa:</strong> {veiculo.placa}</p>
                    <p><strong>Ano:</strong> {veiculo.ano}</p>
                    <p><strong>Cor:</strong> {veiculo.cor}</p>
                    {/* Adicione outros campos que você tenha */}
                    <p><strong>Renavam:</strong> {veiculo.renavam || 'Não informado'}</p>
                    <p><strong>Chassi:</strong> {veiculo.chassi || 'Não informado'}</p>
                    <p><strong>Secretaria:</strong> {veiculo.secretaria || 'Não informada'}</p>
                </div>
                
            </div>
        </div>
    );
}