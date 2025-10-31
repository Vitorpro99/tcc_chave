import styles from './lista.module.css';

export default function ListaMultas({ multas, formatarData, formatarValor, onExcluir }) {
    return (
        <div className={styles.lateralSection}>
            <h3>Histórico de Multas</h3>
            {multas && multas.length > 0 ? (
                <ul className={styles.lateralList}>
                    {multas.map((multa) => (
                        <li key={multa.id} className={styles.lateralItem}>
                            <p><strong>Data:</strong> {formatarData(multa.data)}</p>
                            <p><strong>Descrição:</strong> {multa.descricao}</p>
                            <p><strong>Valor:</strong> {formatarValor(multa.valor)}</p>
                            <button 
                                type="button" 
                                className={styles.deleteButtonSmall} 
                                onClick={() => onExcluir(multa.id)}
                            >
                                Excluir
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noRecords}>Nenhum registro de multa encontrado.</p>
            )}
        </div>
    );
}