import React from 'react'
import styles from './Footer.module.css'

const FooterPayments = () => {
  return (
    <>
        <section className={styles.payment_sec}>
            <div className={styles.payment_container}>
                <div>
                    <h2>Formas de Pagamento</h2>

                    <div className={styles.payment_method}>
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/visa.png?v=636991622524900000" alt="Visa" />
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/master.png?v=636991622505470000" alt="MasterCard" />
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/american.png?v=636991622435270000" alt="American Express" />
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/elo.png?v=636991622475730000" alt="Elo" />
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/pay.png?v=636991622515770000" alt="Paypal" />
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/hiper.png?v=636991622495200000" alt="Hipercard" />
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/boleto.png?v=636991622455130000" alt="Boleto" />
                    </div>

                    <div className={styles.paymee}>
                        <img src="https://livrariacultura.vteximg.com.br/arquivos/bancos-paymee-footer.png?v=637073723029000000" alt="Pay Mee: Banco do Brasil, Banco Itaú, Banco Santander, Banco Caixa, Banco Inter, Banco BS2" />
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default FooterPayments