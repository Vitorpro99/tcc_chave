import styles from "@/styles/form.module.css"

export default function VeiculoPage() {
    return(
        <div className={styles.body}>
            <div  className={styles.formDiv}>
                <form className ={styles.form}>
                    <h1 className={styles.title}>CADASTRO DE VEÍCULOS</h1>
                    {/* Marca */}
                    <label className={styles.label} htmlFor="marca">Marca</label>
                    <input className={styles.input} name="marca" type="text" placeholder="Digite a merca do veículo"/>
                    {/* Modelo */}
                    <label className={styles.label} htmlFor="modelo">Modelo</label>
                    <input className={styles.input} name="modelo" type="text" placeholder="Digite o modelo do veículo" /> 
                    {/* Ano */}
                    <label className={styles.label} htmlFor="ano">Ano</label>
                    <input className={styles.input} min="1900" max={2100} name="ano" type="number" placeholder="Ano do veículo"/> 
                    {/* Placa */}
                    <label className={styles.label} htmlFor="placa">Placa</label>
                    <input className={styles.inputPlaca} name="placa" type="text" placeholder="" /> 
                    {/* Data aquisição */}
                    <label className={styles.label} htmlFor="dataAquisicao">Data de aquisição</label>
                    <input className={styles.input} name="dataAquisicao" type="date"/> 
                    {/* Setor */}
                    <label className={styles.label} htmlFor="setorId">Setor</label>
                    <input className={styles.input} name="setorId" placeholder="Digite o setor do veículo" type="number"/> 
                    
                    <button className={styles.mainButton} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}