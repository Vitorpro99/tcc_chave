import styles from '@/styles/Landing.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Gestão de Frota. Todos os direitos reservados.</p>
    </footer>
  );
}