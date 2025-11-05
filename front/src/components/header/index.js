import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
    
    return (
        <header className={styles.app_header}>
            <nav className={styles.header_nav}>
                <ul>
                    {/* Item 1: Veículo */}
                    <li className={styles.dropdown}>
                        <button 
                            className={styles.dropdown_toggle}
                            aria-haspopup="true"
                        >
                            Veículo ▼
                        </button>
            
                        <ul className={styles.dropdown_menu}>
                            {/* ALTERAÇÃO: 
                              - Removemos a tag <a>
                              - Adicionamos a className direto no <Link>
                            */}
                            <li><Link href="/veiculo" className={styles.dropdown_link}>Cadastro</Link></li>
                            <li><Link href="/listaVeiculos" className={styles.dropdown_link}>Lista</Link></li>
                            <li><Link href="/transferencias" className={styles.dropdown_link}>Transferências</Link></li>
                            <li><Link href="/relatorios" className={styles.dropdown_link}>Relatórios</Link></li>
                        </ul>
                    </li>

                    {/* Item 2: Usuário */}
                    <li className={styles.dropdown}>
                        <button 
                            className={styles.dropdown_toggle}
                            aria-haspopup="true"
                        >
                            Usuário ▼
                        </button>
                    
                        <ul className={styles.dropdown_menu}>
                            <li><Link href="/cadastro" className={styles.dropdown_link}>Cadastro</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
}