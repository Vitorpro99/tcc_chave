import api from "@/services/api";
import { useEffect, useState } from "react";
import styles from "../../styles/Lista.module.css";
import CardVeiculo from "@/components/cardVeiculo";
import ModalVeiculo from "@/components/modalVeiculo";
import { useRouter } from "next/router";

export default function ListaVeiculosPage() {
    const [veiculos, setVeiculos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12); 
    const [selectedVeiculo, setSelectedVeiculo] = useState(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false); 
    const router = useRouter();

    const getVeiculos = () => {
        api
            .get('veiculos')
            .then((result) => {
                setVeiculos(result.data);
            })
            .catch((err) => {
                console.error("Erro ao buscar veículos:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert("A sua sessão expirou. Por favor, faça login novamente.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    router.push('/login');
                }
            });
    }

  
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Você precisa estar logado para aceder a esta página.");
            router.push('/login');
        } else {
            getVeiculos();
        }
    }, []);

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


    const handleOpenModal = async (veiculoResumido) => {
        setIsLoadingModal(true); 
        setSelectedVeiculo(veiculoResumido); 

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

            {selectedVeiculo && (
                <ModalVeiculo
                    veiculo={selectedVeiculo}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}