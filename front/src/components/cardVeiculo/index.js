import styles from './cardVeiculo.module.css'

export default function cardVeiculo({veiculo}) {

    return(
    <tr>
        <td>{veiculo.marca}</td>
        <td>{veiculo.modelo}</td>
        <td>{veiculo.ano}</td>
        <td>{veiculo.placa}</td>
        <td>{veiculo.cor}</td>
        <td><button>Editar</button></td>
    </tr>
    )

}