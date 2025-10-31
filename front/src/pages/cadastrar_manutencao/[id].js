// Ficheiro: pages/manutencao/cadastrar/[id].js

import styles from '@/styles/form.module.css'; // O teu estilo atual
import { useState, useEffect } from 'react'; // Importamos o useEffect
import api from '@/services/api';
import { useRouter } from 'next/router';

export default function ManutencaoPageAdaptada() {
    const router = useRouter();
    // 1. CAPTURAR O ID DA URL
    // Usamos o hook useRouter para pegar o valor do parâmetro [id]
    const { id: veiculoId } = router.query;

    // 2. (BÓNUS UX) ESTADO PARA GUARDAR OS DADOS DO VEÍCULO
    const [veiculoInfo, setVeiculoInfo] = useState(null);

    // 3. (BÓNUS UX) BUSCAR DADOS DO VEÍCULO PARA EXIBIR NA TELA
    useEffect(() => {
        // Esta verificação garante que o código só roda quando o veiculoId já foi obtido da URL
        if (veiculoId) {
            api.get(`/veiculos/${veiculoId}`)
                .then(response => {
                    setVeiculoInfo(response.data); // Armazenamos os dados do veículo
                })
                .catch(err => {
                    console.error("Erro ao buscar veículo:", err);
                    alert("Não foi possível encontrar os dados do veículo.");
                });
        }
    }, [veiculoId]); // O array de dependências garante que este efeito rode sempre que o veiculoId mudar

    // 4. ATUALIZAR A FUNÇÃO DE SUBMISSÃO
    const handleSubmit = (e) => {
        e.preventDefault();
        // Pegamos os valores dos campos do formulário
        const { data, tipo, valor, observacoes } = e.target;

        // Montamos o objeto para salvar, usando o veiculoId da URL
        var manutencaoSalvar = {
            data: data.value,
            tipo: tipo.value,
            valor: parseFloat(valor.value),
            observacoes: observacoes.value,
            // A grande mudança está aqui: usamos o ID da URL, não de um input
            veiculoId: parseInt(veiculoId),
        };

        api
            .post("/manutencoes", manutencaoSalvar)
            .then((res) => {
                alert("Manutenção cadastrada com sucesso!");
                router.push("/listaVeiculos"); // Redireciona para a lista de veículos
            })
            .catch((err) => {
                console.error("Erro ao cadastrar:", err);
                alert("Erro ao cadastrar manutenção: " + (err?.response?.data?.message ?? err.message));
            });
    };

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* 5. TÍTULO DINÂMICO */}
                    <h1 className={styles.title}>
                        CADASTRO DE MANUTENÇÃO PARA: <br/>
                        {veiculoInfo ? `${veiculoInfo.marca} ${veiculoInfo.modelo} - ${veiculoInfo.placa}` : "Carregando..."}
                    </h1>
                    
                   
                    <label className={styles.label} htmlFor="data">Data</label>
                    <input className={styles.input} name="data" type="date" required />
                    
                   
                    <label className={styles.label} htmlFor="tipo">Tipo de Manutenção</label>
                    <input className={styles.input} name="tipo" type="text" placeholder="Ex: Troca de óleo, Preventiva" required />
                    
                    
                    <label className={styles.label} htmlFor="valor">Valor</label>
                    <input className={styles.input} name="valor" type="number" step="0.01" placeholder="Custo do serviço" required />

                   
                    <label className={styles.label} htmlFor="observacoes">Observações</label>
                    <textarea className={styles.input} name="observacoes" placeholder="Detalhes sobre a manutenção"></textarea>
                    
                  
                    <button className={styles.mainButton} type="submit" disabled={!veiculoId}>
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
}