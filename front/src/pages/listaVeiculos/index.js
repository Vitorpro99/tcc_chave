// pages/listaVeiculos.js (ou onde seu arquivo estiver)

import api from "@/services/api";
import { useEffect, useState } from "react";
import styles from "../../styles/Lista.module.css";
import CardVeiculo from "@/components/cardVeiculo";
import ModalVeiculo from "@/components/modalVeiculo"; // <-- 1. Importe o novo componente

export default function ListaVeiculosPage() {
    const [veiculos, setVeiculos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    

    // --- 2. Estado para controlar o modal ---
    // Começa como null (modal fechado). Quando um veículo for selecionado,
    // ele guardará o objeto completo daquele veículo.
    const [selectedVeiculo, setSelectedVeiculo] = useState(null);

    // (O resto do seu código getVeiculos, useEffect, e lógica de paginação continua igual...)
    const getVeiculos = () => {
        api
            .get('veiculos')
            .then((result) => {
                setVeiculos(result.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        getVeiculos();
    }, [])
    useEffect(() => { getVeiculos(); }, []);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = veiculos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(veiculos.length / itemsPerPage);
    const handleNextPage = () => { /* ... */ };
    const handlePrevPage = () => { /* ... */ };
    const handlePageClick = (pageNumber) => { /* ... */ };


    // --- 3. Funções para controlar o modal ---
    const handleOpenModal = (veiculo) => {
        setSelectedVeiculo(veiculo);
    };

    const handleCloseModal = () => {
        setSelectedVeiculo(null);
    };

    return (
        <>
            <div className={styles.container}>
                {/* Seu título e tabela continuam aqui */}
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
                                <th className={styles.emptyRow}>Ações</th> {/* Mudei para "Ações" */}
                                <th className={styles.emptyRow}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 && currentItems.map((veiculo) => (
                                // --- 4. Passe a função para o CardVeiculo ---
                                <CardVeiculo
                                    key={veiculo.id || veiculo.placa}
                                    veiculo={veiculo}
                                    onViewDetails={handleOpenModal} // Passando a função como prop
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sua paginação continua aqui */}
                {/* ... */}
            </div>

            {/* --- 5. Renderização condicional do Modal --- */}
            {/* O modal só será renderizado se 'selectedVeiculo' não for nulo */}
            {selectedVeiculo && (
                <ModalVeiculo
                    veiculo={selectedVeiculo}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}