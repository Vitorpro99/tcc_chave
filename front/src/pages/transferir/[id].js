import styles from "@/styles/form.module.css";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/router";

export default function TransferirVeiculoPage() {
    const router = useRouter();
    const { id: veiculoId } = router.query;

    const [veiculo, setVeiculo] = useState(null);
    const [setores, setSetores] = useState([]);
    const [setorDestinoId, setSetorDestinoId] = useState(""); 
    const [motivo, setMotivo] = useState("");

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

        // Adicionada uma verificação de segurança extra
        if (!veiculo) {
            alert("Erro: Os dados do veículo ainda não foram carregados.");
            return;
        }

        if (!setorDestinoId) {
            alert("Por favor, selecione um setor de destino.");
            return;
        }

        if (parseInt(setorDestinoId) === veiculo.setorId) {
            alert("O setor de destino não pode ser igual ao setor de origem.");
            return;
        }

        const dadosTransferencia = {
            veiculoId: veiculo.id, 
            setorDestinoId: parseInt(setorDestinoId),
            setorOrigemId: veiculo.setorId,
            motivo: motivo
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
                    <h1 className={styles.title}>A carregar dados...</h1>
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
                        
                        {setores
                            .filter(setor => setor.id !== veiculo.setorId)
                            .map((setor) => (
                                <option key={setor.id} value={setor.id}>
                                    {setor.nome}
                                </option>
                        ))}
                    </select>
                    <label className={styles.label} htmlFor="motivo">Motivo da Transferência</label>
                    <textarea
                        className={styles.input}
                        name="motivo"
                        id="motivo"
                        rows="3"
                        placeholder="Ex: Necessidade operacional, manutenção, entre outros."
                        required
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        style={{ resize: "vertical", fontFamily: "inherit" }}
                    />

                    <button className={styles.mainButton} type="submit">Solicitar Transferência</button>
                </form>
            </div>
        </div>
    );
}