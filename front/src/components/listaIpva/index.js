import styles from './lista.module.css';

export default function ListaIpva({ ipvaList, formatarValor, onExcluir }) {
    return (
        <div className={styles.lateralSection}>
            <h3>Histórico de IPVA</h3>
            {ipvaList && ipvaList.length > 0 ? (
                <ul className={styles.lateralList}>
                    {ipvaList.map((ipva) => (
                        <li key={ipva.id} className={styles.lateralItem}>
                            <p><strong>Ano:</strong> {ipva.ano}</p>
                            <p><strong>Valor:</strong> {formatarValor(ipva.valor)}</p>
                            {ipva.descricao && <p><strong>Obs:</strong> {ipva.descricao}</p>}
                            <button 
                                type="button" 
                                className={styles.deleteButtonSmall} 
                                onClick={() => onExcluir(ipva.id)}
                            >
                                Excluir
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noRecords}>Nenhum registro de IPVA encontrado.</p>
            )}
        </div>
    );
}