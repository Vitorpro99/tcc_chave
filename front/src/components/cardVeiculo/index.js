import api from '@/services/api'
import styles from './cardVeiculo.module.css'
import router from 'next/router'
export default function cardVeiculo({veiculo}) {



    const excluirVeículo = (id) =>{
        api
        .delete(`veiculos/${id}`)
        .then((res)=> {
            alert("Veículo excluido com sucesso")
            router.reload();}
    )
        .catch((err) => alert("Erro ao excluir"))
    }
    const editarVeiculo = (id) =>{
        router.push(`/editar-veiculo/${id}`)
    }
    return(
    <tr>
        <td>{veiculo.marca}</td>
        <td>{veiculo.modelo}</td>
        <td>{veiculo.ano}</td>
        <td>{veiculo.placa}</td>
        <td>{veiculo.cor}</td>
        <td><button type="button" className={styles.editButton} onClick={() => editarVeiculo(veiculo.id)}>Editar</button></td>
        <td><button type="button" className={styles.deleteButton} onClick={() => excluirVeículo(veiculo.id)}>Excluir</button></td>
    </tr>
    )

}