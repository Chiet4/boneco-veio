import React from 'react'
import styles from './Footer.module.css'

const FooterCertificate = () => {
  return (
    <>
        <section className={styles.certificate_sec}>
            <div className={styles.certificate_container}>
                <h2>Certificados</h2>

                <img src="https://livrariacultura.vteximg.com.br/arquivos/selo_premio_ra_2021_oficial_252x123.png?v=637747455072400000" alt="Certificado Reclame Aqui" />
            </div>
        </section>
    </>
  )
}

export default FooterCertificate