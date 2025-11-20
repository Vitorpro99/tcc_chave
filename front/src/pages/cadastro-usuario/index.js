import styles from "@/styles/form.module.css";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function UsuarioPage() {
    const router = useRouter();


    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [numeroReg, setNumeroReg] = useState("");
    const [setorId, setSetorId] = useState("");
    const [gestor, setGestor] = useState(false); 

    const [setores, setSetores] = useState([]);

    // 2. Buscar setores ao carregar a página
    useEffect(() => {
        api.get("/setores")
            .then((res) => {
                setSetores(res.data);
            })
            .catch((err) => {
                console.error("Erro ao buscar setores:", err);
                alert("Não foi possível carregar a lista de setores.");
            });
    }, []);

    // 3. Função de Envio Corrigida
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação simples para garantir que um setor foi escolhido
        if (!setorId) {
            alert("Por favor, selecione um setor.");
            return;
        }

        var usuarioSalvar = {
            nome: nome,
            senha: senha,
            email: email,
            numero_reg: numeroReg,
            setorId: parseInt(setorId), 
            
            gestor: gestor,
        };

        try {
            await api.post("/usuarios", usuarioSalvar);
            alert("Usuário cadastrado com sucesso!");
            // Redireciona para o login para testar o novo usuário imediatamente
            router.push("/login"); 
        } catch (err) {
            alert("Erro ao cadastrar usuário");
            alert(err?.response?.data?.message ?? err.message);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>CADASTRO DE USUÁRIO</h1>
                    
                    {/* Nome */}
                    <label className={styles.label} htmlFor="nome">Nome Completo</label>
                    <input 
                        className={styles.input} 
                        name="nome" 
                        type="text" 
                        placeholder="Digite o nome do usuário" 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required 
                    />
                    
                    {/* E-mail */}
                    <label className={styles.label} htmlFor="email">E-mail</label>
                    <input 
                        className={styles.input} 
                        name="email" 
                        type="email" 
                        placeholder="Digite o e-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />

                    {/* Senha */}
                    <label className={styles.label} htmlFor="senha">Senha</label>
                    <input 
                        className={styles.input} 
                        name="senha" 
                        type="password" 
                        placeholder="Crie uma senha" 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required 
                    />
                    
                    {/* Número de Registro */}
                    <label className={styles.label} htmlFor="numero_reg">Número de Registro</label>
                    <input 
                        className={styles.input} 
                        name="numero_reg" 
                        type="text" 
                        placeholder="Matrícula ou CNH" 
                        value={numeroReg}
                        onChange={(e) => setNumeroReg(e.target.value)}
                    />

                    {/* Setor (Dropdown) */}
                    <label className={styles.label} htmlFor="setorId">Setor</label>
                     <select
                        className={styles.input}
                        name="setorId"
                        id="setorId"
                        required
                        value={setorId}
                        onChange={(e) => setSetorId(e.target.value)} 
                    > 
                        <option value="" disabled>Selecione um setor...</option>
                        {setores.map((setor) => (
                            <option key={setor.id} value={setor.id}>
                                {setor.nome}
                            </option>
                        ))}
                    </select>

                    {/* Gestor */}
                    <div className={styles.checkboxContainer}>
                        <input 
                            className={styles.checkbox} 
                            id="gestor" 
                            name="gestor" 
                            type="checkbox" 
                            checked={gestor}
                            onChange={(e) => setGestor(e.target.checked)}
                        />
                        <label className={styles.label} htmlFor="gestor">É gestor?</label>
                    </div>

                    <button className={styles.mainButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}