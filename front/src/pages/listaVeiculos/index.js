import api from "@/services/api";
import { useEffect, useState } from "react";
import styles from "../../styles/Lista.module.css";
import CardVeiculo from "@/components/cardVeiculo";
import ModalVeiculo from "@/components/modalVeiculo";

export default function ListaVeiculosPage() {
    const [veiculos, setVeiculos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12); // Você pode ajustar este número
    const [selectedVeiculo, setSelectedVeiculo] = useState(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false); // Bónus: estado de carregamento


    const getVeiculos = () => {
        api
            .get('veiculos')
            .then((result) => {
                setVeiculos(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // O useEffect deve ser chamado apenas uma vez para buscar os dados iniciais
    useEffect(() => {
        getVeiculos();
    }, []);

    // --- Lógica de Paginação ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = veiculos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(veiculos.length / itemsPerPage);


    const handleNextPage = () => {

        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Funções para controlar o modal ---
    const handleOpenModal = async (veiculoResumido) => {
        setIsLoadingModal(true); // Ativa o indicador de carregamento
        setSelectedVeiculo(veiculoResumido); // Mostra o modal imediatamente com dados básicos

        try {

            const response = await api.get(`/veiculos/${veiculoResumido.id}`);


            const veiculoCompleto = response.data;


            setSelectedVeiculo(veiculoCompleto);

        } catch (err) {
            console.error("Erro ao buscar detalhes do veículo:", err);
            alert("Não foi possível carregar os detalhes completos do veículo.");
        } finally {
            setIsLoadingModal(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedVeiculo(null);
    };

    return (
        <>
            <div className={styles.container}>
                <h3 className={styles.title}>Listagem de veículos</h3>
                <div className={styles.div_tabela}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Ano</th>
                                <th>Placa</th>
                                <th>Cor</th>
                                <th className={styles.emptyRow}>Setor</th>
                                <th className={styles.emptyRow}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 && currentItems.map((veiculo) => (
                                <CardVeiculo
                                    // A key é essencial para o React em listas
                                    key={veiculo.id || veiculo.placa}

                                    // ANTES ESTAVA: veiculo={selectedVeiculo}
                                    // CORRETO: Passa o 'veiculo' específico deste item do loop
                                    veiculo={veiculo}

                                    // ANTES FALTAVA ESTA LINHA:
                                    // CORRETO: Passa a função que abre o modal para o componente filho
                                    onViewDetails={handleOpenModal}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {veiculos.length > itemsPerPage && (
                    <div className={styles.pagination}>
                        <button onClick={handlePrevPage} disabled={currentPage === 1} className={styles.pageButton}>
                            Anterior
                        </button>


                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageClick(index + 1)}

                                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.pageButton}>
                            Próximo
                        </button>
                    </div>
                )}
            </div>

            {/* --- Renderização condicional do Modal --- */}
            {selectedVeiculo && (
                <ModalVeiculo
                    veiculo={selectedVeiculo}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}