import styles from "@/styles/form.module.css";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function CadastrarMultaPage() {
    const router = useRouter();
    const { id: veiculoId } = router.query;

    // Estados para controlar os campos do formulário
    const [data, setData] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
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

        const multaSalvar = {
            data: data,
            valor: parseFloat(valor),
            descricao: descricao,
            veiculoId: parseInt(veiculoId),
            usuarioId: usuarioId ? parseInt(usuarioId) : null,
        };

        try {
            await api.post("/multas", multaSalvar);
            alert("Multa cadastrada com sucesso!");
            router.push("/listaVeiculos");
        } catch (err) {
            alert("Erro ao cadastrar multa");
            alert(err?.response?.data?.message ?? err.message);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>
                        CADASTRO DE MULTA PARA: <br/>
                        {veiculoInfo ? `${veiculoInfo.marca} ${veiculoInfo.modelo} - ${veiculoInfo.placa}` : "Carregando..."}
                    </h1>
                    
                    <label className={styles.label} htmlFor="data">Data da Infração</label>
                    <input className={styles.input} name="data" type="date" value={data} onChange={(e) => setData(e.target.value)} required />

                    <label className={styles.label} htmlFor="valor">Valor</label>
                    <input className={styles.input} name="valor" type="number" step="0.01" placeholder="Digite o valor da multa" value={valor} onChange={(e) => setValor(e.target.value)} required />

                    <label className={styles.label} htmlFor="descricao">Descrição</label>
                    <input className={styles.input} name="descricao" type="text" placeholder="Descrição da infração" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                    
                    <label className={styles.label} htmlFor="usuarioId">ID do Condutor (Opcional)</label>
                    <input className={styles.input} name="usuarioId" placeholder="ID do condutor responsável" type="number" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} />
                    
                    <button className={styles.mainButton} type="submit" disabled={!veiculoId}>
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
}