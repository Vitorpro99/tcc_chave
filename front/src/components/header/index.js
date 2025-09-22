import styles from './Header.module.css';
// 1. Trocamos os dois 'useState' por um único, e importamos o useRef.
import { useState, useRef } from 'react';

export default function Header() {
    // Agora temos um único estado que guarda o ID do menu aberto ('veiculo', 'usuario', ou null)
    const [menuAberto, setMenuAberto] = useState(null);
    const timerRef = useRef(null);

    // 2. Unificamos os 'handleToggle's. Útil para cliques em telas de toque.
    const handleToggle = (menuId) => {
        setMenuAberto(menuAberto === menuId ? null : menuId);
    };

    // 3. Criamos as funções genéricas de mouse.
    const handleMouseEnter = (menuId) => {
        clearTimeout(timerRef.current); // Cancela qualquer timer de fechamento pendente
        setMenuAberto(menuId);           // Abre o menu correspondente
    };

    const handleMouseLeave = () => {
        // Agenda o fechamento de qualquer menu que estiver aberto
        timerRef.current = setTimeout(() => {
            setMenuAberto(null);
        }, 500); // 0.5 segundos de delay
    };

    return (
        <header className={styles.app_header}>
            <nav className={styles.header_nav}>
                <ul>
                    {/* ===== DROPDOWN "VEÍCULO" ===== */}
                    <li
                        className={styles.dropdown}
                        // 4. Usamos as novas funções genéricas no <li> para uma melhor experiência
                        onMouseEnter={() => handleMouseEnter('veiculo')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button onClick={() => handleToggle('veiculo')} className={styles.dropdown_toggle}>
                            Veículo ▼
                        </button>
                        {/* A condição agora verifica se o estado é igual ao ID 'veiculo' */}
                        {menuAberto === 'veiculo' && (
                            <ul className={styles.dropdown_menu}>
                                <li><a href="/veiculo">Cadastro</a></li>
                                <li><a>Transferências</a></li>
                                <li><a>Relatórios</a></li>
                            </ul>
                        )}
                    </li>


                    <li
                        className={styles.dropdown}
                        // Reutilizamos as mesmas funções, apenas mudando o ID
                        onMouseEnter={() => handleMouseEnter('usuario')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button onClick={() => handleToggle('usuario')} className={styles.dropdown_toggle}>
                            Usuário ▼
                        </button>
                        {/* A condição agora verifica se o estado é igual ao ID 'usuario' */}
                        {menuAberto === 'usuario' && (
                            <ul className={styles.dropdown_menu}>
                                <li><a>Cadastro</a></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}