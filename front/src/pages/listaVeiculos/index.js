import api from "@/services/api";
import { useEffect, useState } from "react";
import styles from "../../styles/Lista.module.css"
import CardVeiculo from "@/components/cardVeiculo";
export default function ListaVeiculosPage() {
    const [veiculos, setVeiculos] = useState([])
    const getVeiculos = () => {
        api
            .get('veiculos')
            .then((result) => {
                setVeiculos(result.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        getVeiculos();
    }, [])

    return (
        <>
            <div className={styles.container}>
            <h3>Listagem de veículos</h3>
                <div className={styles.div_tabela}>
                <table className={styles.table}>
                    <thead>
                        <tr>

                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Ano</th>
                            <th>Placa</th>
                            <th>Cor</th>
                        </tr>
                    </thead>
                    {veiculos?.length > 0 && veiculos.map((veiculo) => <CardVeiculo veiculo={veiculo} />)}

                </table>
                </div>
            </div>
        </>
    )
}