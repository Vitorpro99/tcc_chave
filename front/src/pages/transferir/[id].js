import styles from "@/styles/form.module.css"; // Reutilizando seu CSS de formulário
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function TransferirVeiculoPage() {
    const router = useRouter();
    const { id: veiculoId } = router.query;

    // Estados
    const [veiculo, setVeiculo] = useState(null);
    const [setores, setSetores] = useState([]);
    const [setorDestinoId, setSetorDestinoId] = useState(""); 

    useEffect(() => {
        if (veiculoId) {

            api.get(`/veiculos/${veiculoId}`)
                .then(res => {
                    setVeiculo(res.data);
                })
                .catch(err => {
                    console.error("Erro ao buscar veículo:", err);
                    alert("Não foi possível carregar os dados do veículo.");
                });


            api.get("/setores")
                .then(res => {
                    setSetores(res.data);
                })
                .catch(err => {
                    console.error("Erro ao buscar setores:", err);
                    alert("Não foi possível carregar a lista de setores.");
                });
        }
    }, [veiculoId]); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!setorDestinoId) {
            alert("Por favor, selecione um setor de destino.");
            return;
        }

        if (parseInt(setorDestinoId) === veiculo.setorId) {
            alert("O setor de destino não pode ser igual ao setor de origem.");
            return;
        }

        const dadosTransferencia = {
            veiculoId: parseInt(veiculoId),
            setorDestinoId: parseInt(setorDestinoId),
            setorOrigemId: veiculo.setorId, // O setor atual do veículo
            // O 'usuarioSolicitanteId' será pego pelo backend (do token)
            // O 'status' será 'pendente' por padrão (definido no modelo)
        };

        try {
            await api.post("/transferencias", dadosTransferencia);
            alert("Pedido de transferência enviado com sucesso!");
            router.push("/listaVeiculos");
        } catch (err) {
            alert("Erro ao enviar pedido de transferência.");
            console.error(err);
        }
    };

    if (!veiculo || setores.length === 0) {
        return (
            <div className={styles.body}>
                <div className={styles.formDiv}>
                    <h1 className={styles.title}>A carregar...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.body}>
            <div className={styles.formDiv}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>Solicitar Transferência</h1>
                    
                    <div className={styles.infoVeiculo}>
                        <p><strong>Veículo:</strong> {veiculo.marca} {veiculo.modelo}</p>
                        <p><strong>Placa:</strong> {veiculo.placa}</p>
                        <p><strong>Setor Atual:</strong> {veiculo.setor ? veiculo.setor.nome : "Não definido"}</p>
                    </div>
                    
                    {/* Campo de Seleção do Destino */}
                    <label className={styles.label} htmlFor="setorDestinoId">Transferir para:</label>
                    <select
                        className={styles.input}
                        name="setorDestinoId"
                        id="setorDestinoId"
                        required
                        value={setorDestinoId}
                        onChange={(e) => setSetorDestinoId(e.target.value)}
                    >
                        <option value="" disabled>Selecione o setor de destino...</option>
                        
                        {/* Filtra a lista de setores para NÃO mostrar o setor atual */}
                        {setores
                            .filter(setor => setor.id !== veiculo.setorId)
                            .map((setor) => (
                                <option key={setor.id} value={setor.id}>
                                    {setor.nome}
                                </option>
                        ))}
                    </select>

                    <button className={styles.mainButton} type="submit">Solicitar Transferência</button>
                </form>
            </div>
        </div>
    );
}