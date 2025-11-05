import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/services/api";
import styles from "@/styles/Login.module.css"; // Vamos criar este ficheiro de estilos
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    // Estados para controlar os campos do formulário
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        setIsLoading(true); // Ativa o feedback de carregamento
        setError(""); // Limpa erros antigos

        try {
            const response = await api.post("/usuarios/login", {
                email: email,
                senha: senha,
            });

            // Se o login for bem-sucedido
            if (response.data.accessToken) {
                // Guarda o token e os dados do utilizador no localStorage
                localStorage.setItem("token", response.data.accessToken);
                localStorage.setItem("user", JSON.stringify(response.data));

                // Redireciona para a página principal
                router.push("/lista-veiculos"); // Ou para a sua página de dashboard
            }
        } catch (err) {
            // Trata erros vindos da API (ex: "Senha inválida!")
            const errorMessage = err.response?.data?.message || "Erro ao tentar fazer login. Tente novamente.";
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setIsLoading(false); // Desativa o carregamento, independentemente do resultado
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>LOGIN DO SISTEMA</h1>
                    
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input 
                        className={styles.input} 
                        name="email" 
                        type="email" 
                        placeholder="Digite seu email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    
                    <label className={styles.label} htmlFor="senha">Senha</label>
                    <input 
                        className={styles.input} 
                        name="senha" 
                        type="password" 
                        placeholder="Digite sua senha" 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required 
                    />
                    
                    <button 
                        className={styles.mainButton} 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? "A carregar..." : "Entrar"}
                    </button>
                    
                    {/* Opcional: Link para a página de cadastro de usuário */}
                    <p className={styles.footerText}>
                        Não tem uma conta? 
                        <Link href="/cadastrar-usuario">
                            Registe-se
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}