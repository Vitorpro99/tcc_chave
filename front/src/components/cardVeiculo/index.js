import styles from './cardVeiculo.module.css'

export default function cardVeiculo({veiculo}) {

    return(
    <div className={styles.div}>
        <p>{veiculo.marca}</p><p>{veiculo.modelo}</p><p>{veiculo.ano}</p>
        <p>{veiculo.placa}</p><p>{veiculo.cor}</p>
        <button type="button">Editar</button><button type="button">Excluir</button>
    </div>
    )

}