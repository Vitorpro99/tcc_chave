import styles from "@/styles/form.module.css"

export default function VeiculoPage() {
    return(
        <div className={styles.body}>
            <div  className={styles.formDiv}>
                <form className ={styles.form}>
                    <input className={styles.input} name="marca" type="text" placeholder="Digite a merca do veículo"/>
                    <input className={styles.input} name="moedelo" type="text" placeholder="Digite o modelo do veículo" /> 
                    <input className={styles.input} name="ano" type="number" placeholder="Ano do veículo"/> 
                    <input className={styles.input} name="placa" type="text" placeholder="Digite a placa do veículo" /> 
                    <label className={styles.label} htmlFor="dataAquisicao">Data de aquisição</label>
                    <input name="dataAquisicao" type="date"/> 
                    <input className={styles.input} name="setorId" placeholder="Digite o setor do veículo" type="number"/> 
                    <button type="submit">Buscar</button>
                </form>
            </div>
        </div>
    )
}