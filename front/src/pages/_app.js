
import "@/styles/globals.css";

import Header from "@/components/header";
import { useRouter } from "next/router";
export default function App({ Component, pageProps }) {
const router = useRouter();

  // Lista de páginas onde o Header NÃO deve aparecer
  const paginasSemHeader = [
    "/login",
    "/usuario/cadastro",
    "/", 
    "/404",
    "/relatorios"
  ];

  const deveMostrarHeader = !paginasSemHeader.includes(router.pathname);

  return (
    <>

      {deveMostrarHeader && <Header />}
      
      <Component {...pageProps} />
    </>
  );
}