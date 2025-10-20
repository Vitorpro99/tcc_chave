import styles from "@/styles/form.module.css";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function MultaPage() {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { data, valor, descricao, veiculoId, usuarioId } = e.target;

        var multaSalvar = {
            data: data.value,
            valor: parseFloat(valor.value),
            descricao: descricao.value,
            veiculoId: parseInt(veiculoId.value),
            usuarioId: parseInt(usuarioId.value),
        };

        api
            .post("/multas", multaSalvar)
            .then((res) => {
                alert("Multa cadastrada com sucesso!");
                router.push("/");
            })
            .catch((err) => {
                alert("Erro ao cadastrar multa");
                alert(err?.response?.data?.message ?? err.message);
            });
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>CADASTRO DE MULTA</h1>
                    
                    {/* Data */}
                    <label className={styles.label} htmlFor="data">Data da Infração</label>
                    <input className={styles.input} name="data" type="date" required />

                    {/* Valor */}
                    <label className={styles.label} htmlFor="valor">Valor</label>
                    <input className={styles.input} name="valor" type="number" step="0.01" placeholder="Digite o valor da multa" required />

                    {/* Descrição */}
                    <label className={styles.label} htmlFor="descricao">Descrição</label>
                    <input className={styles.input} name="descricao" type="text" placeholder="Descrição da infração" required />
                    
                    {/* Veiculo ID */}
                    <label className={styles.label} htmlFor="veiculoId">ID do Veículo</label>
                    <input className={styles.input} name="veiculoId" placeholder="ID do veículo autuado" type="number" required />

                    {/* Usuário ID */}
                    <label className={styles.label} htmlFor="usuarioId">ID do Condutor</label>
                    <input className={styles.input} name="usuarioId" placeholder="ID do condutor responsável" type="number" required />
                    
                    <button className={styles.mainButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
