import { useRouter } from 'next/router';
import styles from './Header.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';


export default function Header() {
    
    const router = useRouter();
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    useEffect(() => {
        
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            setUsuarioLogado(JSON.parse(userDataString));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUsuarioLogado(null); // Limpa o estado
        router.push('/login'); // Redireciona para o login
    };

    return (
        <header className={styles.app_header}>
            <nav className={styles.header_nav}>
                <ul>
                    <li className={styles.dropdown}>
                        <button 
                            className={styles.dropdown_toggle}
                            aria-haspopup="true"
                        >
                            Veículo ▼
                        </button>
                        <ul className={styles.dropdown_menu}>
                            <li><Link href="/veiculo" className={styles.dropdown_link}>Cadastro</Link></li>
                            <li><Link href="/listaVeiculos" className={styles.dropdown_link}>Lista</Link></li>
                            <li><Link href="/transferencias" className={styles.dropdown_link}>Transferências</Link></li>
                            <li><Link href="/relatorios" className={styles.dropdown_link}>Relatórios</Link></li>
                            <li><Link href="/dashboard" className={styles.dropdown_link}>Dashboard</Link></li>
                            <li><Link href="/relatorios" className={styles.dropdown_link}>Relatórios</Link></li>
                        </ul>
                    </li>
                    <li className={styles.dropdown}>
                        <button 
                            className={styles.dropdown_toggle}
                            aria-haspopup="true"
                        >
                            Usuário ▼
                        </button>                    
                        <ul className={styles.dropdown_menu}>
                            <li><Link href="/cadastro-usuario" className={styles.dropdown_link}>Cadastro</Link></li>
                        </ul>
                    </li>
                </ul>

            <div className={styles.user_actions}>
                <Link href="/login" className={styles.loginButton}>
                    Login
                </Link>
                {/* Aqui é onde a lógica de logout entraria no futuro:
                isLoggedIn ? (
                    <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
                ) : (
                    <Link href="/login" className={styles.loginButton}>Login</Link>
                )
                */}
            </div>

            </nav>

            <div className={styles.user_actions}>
                {usuarioLogado ? (
                    // 5. Se estiver LOGADO
                    <>
                        <span className={styles.welcomeMessage}>
                            Olá, {usuarioLogado.nome}
                        </span>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Sair
                        </button>
                    </>
                ) : (
                    // 6. Se estiver DESLOGADO
                    <Link href="/login" className={styles.loginButton}>
                        Login
                    </Link>
                )}
            </div>
            


        </header>
    );
}