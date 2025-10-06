import api from "@/services/api";
import { useEffect, useState } from "react";
import styles from "../../styles/Lista.module.css"
import CardVeiculo from "@/components/cardVeiculo"; 
export default function ListaVeiculosPage() {
    const [veiculos, setVeiculos] = useState([])
    const getVeiculos = () =>{
        api
            .get('veiculos')
            .then((result)=>{
                setVeiculos(result.data)
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    useEffect(()=>{
        getVeiculos();        
    }, [])
    
    return (
        <>
            <h3>Listagem de veículos</h3>
            <div className={styles.container}>
                {veiculos?.length > 0 && veiculos.map((veiculo) => <CardVeiculo veiculo={veiculo}/>)}
            </div>
        </>
    )
}