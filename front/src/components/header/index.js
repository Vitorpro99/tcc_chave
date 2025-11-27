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
        setUsuarioLogado(null);
        router.push('/login');
    };

    return (
        <header className={styles.app_header}>
            <div className={styles.container}>
                
                {/* 1. Logo / Título */}
                <div className={styles.logo_area}>
                    <Link href="/dashboard" className={styles.logo_link}>
                        Gestão de Frota
                    </Link>
                </div>

                {/* 2. Navegação Central */}
                <nav className={styles.header_nav}>
                    <ul className={styles.nav_list}>
                        
                        {/* Menu Veículo */}
                        <li className={styles.dropdown}>
                            <button className={styles.dropdown_toggle} aria-haspopup="true">
                                Veículos <span className={styles.arrow}>▼</span>
                            </button>
                            <ul className={styles.dropdown_menu}>
                                <li><Link href="/listaVeiculos" className={styles.dropdown_link}>Consultar Frota</Link></li>
                                <li><Link href="/veiculo" className={styles.dropdown_link}>Novo Cadastro</Link></li>
                                <li className={styles.divider}></li>
                                <li><Link href="/transferencias" className={styles.dropdown_link}>Transferências</Link></li>
                                <li><Link href="/relatorios" className={styles.dropdown_link}>Relatórios</Link></li>
                            </ul>
                        </li>

                        {/* Menu Usuário (Só mostra se for Admin/Gestor, opcional) */}
                        <li className={styles.dropdown}>
                            <button className={styles.dropdown_toggle} aria-haspopup="true">
                                Administração <span className={styles.arrow}>▼</span>
                            </button>                    
                            <ul className={styles.dropdown_menu}>
                                <li><Link href="/cadastro-usuario" className={styles.dropdown_link}>Cadastrar Usuário</Link></li>
                                <li><Link href="/dashboard" className={styles.dropdown_link}>Dashboard Geral</Link></li>
                            </ul>
                        </li>
                    </ul>
                </nav>

                {/* 3. Área do Utilizador (Direita) */}
                <div className={styles.user_actions}>
                    {usuarioLogado ? (
                        <div className={styles.profile_area}>
                            <div className={styles.user_info}>
                                <span className={styles.greeting}>Olá,</span>
                                <span className={styles.username}>{usuarioLogado.nome}</span>
                            </div>
                            <button onClick={handleLogout} className={styles.logoutButton} title="Sair do sistema">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginButton}>
                            Entrar
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
}