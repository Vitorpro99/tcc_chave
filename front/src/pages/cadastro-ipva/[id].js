import styles from "@/styles/form.module.css";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function CadastrarIpvaPage() {
    const router = useRouter();
    const { id: veiculoId } = router.query;

    // Estados para controlar os campos do formulário
    const [ano, setAno] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [veiculoInfo, setVeiculoInfo] = useState(null);

    useEffect(() => {
        if (veiculoId) {
            api.get(`/veiculos/${veiculoId}`)
                .then(response => {
                    setVeiculoInfo(response.data);
                })
                .catch(err => {
                    console.error("Erro ao buscar veículo:", err);
                    alert("Não foi possível encontrar os dados do veículo.");
                });
        }
    }, [veiculoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const ipvaSalvar = {
            ano: parseInt(ano),
            valor: parseFloat(valor),
            descricao: descricao,
            veiculoId: parseInt(veiculoId),
        };

        try {
            await api.post("/ipvas", ipvaSalvar);
            alert("IPVA cadastrado com sucesso!");
            router.push("/listaVeiculos");
        } catch (err) {
            alert("Erro ao cadastrar IPVA");
            alert(err?.response?.data?.message ?? err.message);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>
                        CADASTRO DE IPVA PARA: <br/>
                        {veiculoInfo ? `${veiculoInfo.marca} ${veiculoInfo.modelo} - ${veiculoInfo.placa}` : "Carregando..."}
                    </h1>
                    
                    <label className={styles.label} htmlFor="ano">Ano</label>
                    <input className={styles.input} name="ano" type="number" min="1900" max="2100" placeholder="Ano de referência do IPVA" value={ano} onChange={(e) => setAno(e.target.value)} required />
                    
                    <label className={styles.label} htmlFor="valor">Valor</label>
                    <input className={styles.input} name="valor" type="number" step="0.01" placeholder="Digite o valor" value={valor} onChange={(e) => setValor(e.target.value)} required />
                    
                    <label className={styles.label} htmlFor="descricao">Descrição</label>
                    <input className={styles.input} name="descricao" type="text" placeholder="Ex: IPVA 2025 Quota Única" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    
                    <button className={styles.mainButton} type="submit" disabled={!veiculoId}>
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
}