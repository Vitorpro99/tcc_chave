import styles from "@/styles/form.module.css";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function VeiculoPage() {
    const router = useRouter();
    
    // Estados para cada campo do formulário (Componente Controlado)
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [ano, setAno] = useState("");
    const [placa, setPlaca] = useState("");
    const [dataAquisicao, setDataAquisicao] = useState("");
    const [cor, setCor] = useState("");
    const [setorId, setSetorId] = useState(""); // Estado para o <select>

    // Estado para a lista de setores (Nome corrigido para plural)
    const [setores, setSetores] = useState([]);

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

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
    
        var veiculoSalvar = {
            marca: marca,
            modelo: modelo,
            ano: parseInt(ano),
            placa: placa,
            dataAquisicao: dataAquisicao, 
            cor: cor,
            setorId: parseInt(setorId)
        };

        try {
            await api.post("/veiculos", veiculoSalvar);
            alert("Veículo cadastrado com sucesso!");
            router.push("/listaVeiculos"); // Redireciona para a lista
        } catch (err) {
            alert("Erro ao cadastrar veículo");
            alert(err?.response?.data?.message ?? err.message);
        }
    };

    return(
        <div className={styles.body}>
            <div  className={styles.formDiv}>
                <form onSubmit={handleSubmit} className ={styles.form}>
                    <h1 className={styles.title}>CADASTRO DE VEÍCULOS</h1>
                    
                    <label className={styles.label} htmlFor="marca">Marca</label>
                    <input className={styles.input} name="marca" type="text" placeholder="Digite a merca do veículo" value={marca} onChange={(e) => setMarca(e.target.value)} required />
                    
                    <label className={styles.label} htmlFor="modelo">Modelo</label>
                    <input className={styles.input} name="modelo" type="text" placeholder="Digite o modelo do veículo" value={modelo} onChange={(e) => setModelo(e.target.value)} required /> 
                    
                    <label className={styles.label} htmlFor="ano">Ano</label>
                    <input className={styles.input} min="1900" max={2100} name="ano" type="number" placeholder="Ano do veículo" value={ano} onChange={(e) => setAno(e.target.value)} required /> 
                    
                    <label className={styles.label} htmlFor="cor">Cor</label>
                    <input className={styles.input} name="cor" type="text" placeholder="Digite a cor do veículo" value={cor} onChange={(e) => setCor(e.target.value)} required />
                    
                    <label className={styles.label} htmlFor="placa">Placa</label>
                    <input className={styles.inputPlaca} name="placa" type="text" placeholder="ABC-1234" value={placa} onChange={(e) => setPlaca(e.target.value)} required /> 
                    
                    <label className={styles.label} htmlFor="dataAquisicao">Data de aquisição</label>
                    <input className={styles.input} name="dataAquisicao" type="date" value={dataAquisicao} onChange={(e) => setDataAquisicao(e.target.value)} required /> 
                    
                    
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
                    
                    <button className={styles.mainButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}