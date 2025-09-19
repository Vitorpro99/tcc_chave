
import "@/styles/globals.css";

import Header from "@/components/header";

export default function App({ Component, pageProps }) {
  

  return (
  
    <>
     
      <Header />
      
      {/* Agora o componente da página será renderizado logo abaixo do Header */}
      <Component {...pageProps} />
    </>
  );
}