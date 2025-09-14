import React from 'react'
import styles from './Footer.module.css'

const FooterBot = () => {
  return (
    <>
        <section className={styles.bot_sec}>
            <div className={styles.bot_container}>
                <p>Boneco Veio, todos os direitos reservados. Copyrights 2025</p>
                <p>Boneco Veio S/A |Av. Dr. Silas Munguba, 1700 - Itaperi, Fortaleza - CE, CEP 60714-903 <br/> CNPJ XX.XXX.XXX/XXXX-XX | IE YYY.YYY.YYY.YYY | PABX ZZ ZZZZ-ZZZZ</p>
                
                <p>Os preços, condições de pagamento e valores de frete são válidos exclusivamente para as compras efetuadas em nosso site, não valendo, necessariamente, para as nossas lojas físicas.</p>
            </div>
        </section>
    </>
  )
}

export default FooterBot