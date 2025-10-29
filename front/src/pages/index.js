import Head from "next/head";
import Link from "next/link";


import styles from "@/styles/Landing.module.css"; 
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Gestão de Frota - Início</title>
        <meta name="description" content="Sistema completo para gestão de frotas de veículos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.pageContainer}>

        <main className={styles.main}>
          <section className={styles.hero}>
            <h1 className={styles.title}>
              O Controle Total da Sua Frota na Palma da Sua Mão
            </h1>
            <p className={styles.description}>
              Simplifique a gestão de veículos, manutenções e documentação com a nossa plataforma intuitiva.
            </p>
            <Link href="/lista-veiculos" legacyBehavior>
              <a className={styles.ctaButton}>Acessar o Painel</a>
            </Link>
          </section>
          <section className={styles.features}>
            <h2 className={styles.sectionTitle}>Funcionalidades Principais</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <h3>Controle de Veículos</h3>
                <p>Cadastre e monitore todos os veículos da sua frota em um só lugar.</p>
              </div>
              <div className={styles.featureCard}>
                <h3>Histórico de Manutenções</h3>
                <p>Nunca mais perca uma data de manutenção. Registre e consulte históricos completos.</p>
              </div>
              <div className={styles.featureCard}>
                <h3>Gestão Simplificada</h3>
                <p>Acesse relatórios e informações importantes para tomar as melhores decisões.</p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}