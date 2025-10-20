import styles from "@/styles/form.module.css";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function UsuarioPage() {
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { nome, senha, email, numero_reg, setor, gestor } = e.target;

        var usuarioSalvar = {
            nome: nome.value,
            senha: senha.value,
            email: email.value,
            numero_reg: numero_reg.value,
            setor: setor.value,
            gestor: gestor.checked, // Captura o valor booleano do checkbox
        };

        api
            .post("/usuarios", usuarioSalvar)
            .then((res) => {
                alert("Usuário cadastrado com sucesso!");
                router.push("/");
            })
            .catch((err) => {
                alert("Erro ao cadastrar usuário");
                alert(err?.response?.data?.message ?? err.message);
            });
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>CADASTRO DE USUÁRIO</h1>
                    
                    {/* Nome */}
                    <label className={styles.label} htmlFor="nome">Nome Completo</label>
                    <input className={styles.input} name="nome" type="text" placeholder="Digite o nome do usuário" required />
                    
                    {/* E-mail */}
                    <label className={styles.label} htmlFor="email">E-mail</label>
                    <input className={styles.input} name="email" type="email" placeholder="Digite o e-mail" required />

                    {/* Senha */}
                    <label className={styles.label} htmlFor="senha">Senha</label>
                    <input className={styles.input} name="senha" type="password" placeholder="Crie uma senha" required />
                    
                    {/* Número de Registro */}
                    <label className={styles.label} htmlFor="numero_reg">Número de Registro</label>
                    <input className={styles.input} name="numero_reg" type="text" placeholder="Matrícula ou CNH" />

                    {/* Setor */}
                    <label className={styles.label} htmlFor="setor">Setor</label>
                    <input className={styles.input} name="setor" type="text" placeholder="Setor do usuário" required />
                    
                    {/* Gestor */}
                    <div className={styles.checkboxContainer}>
                        <input className={styles.checkbox} id="gestor" name="gestor" type="checkbox" />
                        <label className={styles.label} htmlFor="gestor">É gestor?</label>
                    </div>

                    <button className={styles.mainButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}
