import styles from "@/styles/form.module.css";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function SetorPage() {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { nome, veiculos } = e.target;

        // O campo 'veiculos' pode precisar de um tratamento especial
        // dependendo de como o backend espera recebê-lo (ex: array de IDs).
        // Aqui, enviamos como string.
        var setorSalvar = {
            nome: nome.value,
            veiculos: veiculos.value, 
        };

        api
            .post("/setores", setorSalvar)
            .then((res) => {
                alert("Setor cadastrado com sucesso!");
                router.push("/");
            })
            .catch((err) => {
                alert("Erro ao cadastrar setor");
                alert(err?.response?.data?.message ?? err.message);
            });
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>CADASTRO DE SETOR</h1>
                    
                    {/* Nome */}
                    <label className={styles.label} htmlFor="nome">Nome do Setor</label>
                    <input className={styles.input} name="nome" type="text" placeholder="Ex: Logística, Diretoria" required />

                    {/* Veículos */}
                    <label className={styles.label} htmlFor="veiculos">Veículos</label>
                    <input className={styles.input} name="veiculos" type="text" placeholder="IDs dos veículos, separados por vírgula" />

                    <button className={styles.mainButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
