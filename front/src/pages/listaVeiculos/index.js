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
    const handleOpenModal = (veiculo) => {
        setSelectedVeiculo(veiculo);
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
                                <th className={styles.emptyRow}>Ações</th>
                                <th className={styles.emptyRow}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 && currentItems.map((veiculo) => (
                                <CardVeiculo
                                    key={veiculo.id || veiculo.placa}
                                    veiculo={veiculo}
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