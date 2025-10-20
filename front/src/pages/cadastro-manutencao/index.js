import styles from "@/styles/form.module.css";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function ManutencaoPage() {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { data, tipo, valor, observacoes, veiculoId } = e.target;

        var manutencaoSalvar = {
            data: data.value,
            tipo: tipo.value,
            valor: parseFloat(valor.value),
            observacoes: observacoes.value,
            veiculoId: parseInt(veiculoId.value),
        };

        api
            .post("/manuntencoes", manutencaoSalvar)
            .then((res) => {
                alert("Manutenção cadastrada com sucesso!");
                router.push("/");
            })
            .catch((err) => {
                alert("Erro ao cadastrar manutenção");
                alert(err?.response?.data?.message ?? err.message);
            });
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>CADASTRO DE MANUTENÇÃO</h1>
                    
                    {/* Data */}
                    <label className={styles.label} htmlFor="data">Data</label>
                    <input className={styles.input} name="data" type="date" required />
                    
                    {/* Tipo */}
                    <label className={styles.label} htmlFor="tipo">Tipo de Manutenção</label>
                    <input className={styles.input} name="tipo" type="text" placeholder="Ex: Troca de óleo, Preventiva" required />
                    
                    {/* Valor */}
                    <label className={styles.label} htmlFor="valor">Valor</label>
                    <input className={styles.input} name="valor" type="number" step="0.01" placeholder="Custo do serviço" required />

                    {/* Observações */}
                    <label className={styles.label} htmlFor="observacoes">Observações</label>
                    <textarea className={styles.input} name="observacoes" placeholder="Detalhes sobre a manutenção"></textarea>
                    
                    {/* Veiculo ID */}
                    <label className={styles.label} htmlFor="veiculoId">ID do Veículo</label>
                    <input className={styles.input} name="veiculoId" placeholder="Digite o ID do veículo" type="number" required />
                    
                    <button className={styles.mainButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
