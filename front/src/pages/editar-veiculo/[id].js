import styles from "@/styles/form.module.css";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function VeiculoPage() {
    const router = useRouter();
    const { id } = router.query;

    const [veiculo, setVeiculo] = useState({
        marca: '',
        modelo: '',
        ano: '',
        placa: '',
        dataAquisicao: '',
        cor: ''
    });

    useEffect(() => {
        if (router.isReady) {
            if (id) {
                api
                    .get(`/veiculos/${id}`)
                    .then((res) => {
                        console.log("Dados do veículo recebidos:", res.data);
                        if (res.data.dataAquisicao) {
                            res.data.dataAquisicao = res.data.dataAquisicao.split('T')[0];
                        }
                        setVeiculo(res.data);
                    })
                    .catch((err) => {
                        alert("Erro ao recuperar dados do veículo");
                        console.error(err?.response?.data?.message ?? err.message);
                    });
            }
        }
    }, [router.isReady, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVeiculo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        api
            .put(`/veiculos/${id}`, veiculo) 
            .then((res) => {
                alert("Veículo editado com sucesso!");
                router.push("/listaVeiculos"); 
            })
            .catch((err) => {
                alert("Erro ao editar o veículo");
                console.error(err?.response?.data?.message ?? err.message);
            });
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>EDITAR VEÍCULO</h1>
                    
                  
                    <label className={styles.label} htmlFor="marca">Marca</label>
                    <input className={styles.input} value={veiculo.marca || ''} onChange={handleChange} name="marca" type="text" placeholder="Digite a marca do veículo" />
                    
                    <label className={styles.label} htmlFor="modelo">Modelo</label>
                    <input className={styles.input} value={veiculo.modelo || ''} onChange={handleChange} name="modelo" type="text" placeholder="Digite o modelo do veículo" />
                    
                    <label className={styles.label} htmlFor="ano">Ano</label>
                    <input className={styles.input} value={veiculo.ano || ''} onChange={handleChange} name="ano" type="number" placeholder="Ano do veículo" />
                    
                    <label className={styles.label} htmlFor="cor">Cor</label>
                    <input className={styles.input} value={veiculo.cor || ''} onChange={handleChange} name="cor" type="text" placeholder="Digite a cor do veículo" />
                    
                    <label className={styles.label} htmlFor="placa">Placa</label>
                    <input className={styles.inputPlaca} value={veiculo.placa || ''} onChange={handleChange} name="placa" type="text" />
                    
                    <label className={styles.label} htmlFor="dataAquisicao">Data de aquisição</label>
                    <input className={styles.input} value={veiculo.dataAquisicao || ''} onChange={handleChange} name="dataAquisicao" type="date" />
                    
                    <label className={styles.label} htmlFor="setorId">Setor</label>
                    <input className={styles.input} disabled readOnly name="setorId" placeholder="Digite o setor do veículo" type="number" />

                    <button className={styles.mainButton} type="submit">Salvar Alterações</button>
                </form>
            </div>
        </div>
    );
}