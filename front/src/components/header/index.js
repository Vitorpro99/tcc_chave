    import styles from './Header.module.css'
    import { useState } from 'react'


    export default function Header() {

        const [aberto, setAberto] = useState(false)

        const handToogle = () => {
            setAberto(!aberto);
        }

        return (

            <header className={styles.app_header}>
                <nav className={styles.header_nav}>
                    <ul>
                        <li>
                            <button onClick={handToogle} className={styles.handToogle}>
                                Veiculo ▼
                            </button>
                            {aberto && <ul>
                                <li><a>Cadastro</a></li>
                                <li>Transferências</li>
                                <li>Relátorios</li>
                            </ul>
                        }
                        </li>
                            <li><a>Usuário</a></li>
                    </ul>
                </nav>
            </header>

    )
    }