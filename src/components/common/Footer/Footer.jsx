import React from 'react'
import styles from './Footer.module.css'
import FooterSocials from './FooterSocials'
import FooterLinks from './FooterLinks'
import FooterPayments from './FooterPayments'
import FooterCertificate from './FooterCertificate'
import FooterBot from './FooterBot'

const Footer = () => {
  return (
    <div className={styles.footer_sec}>
        <div className={styles.footer_container}>
          <FooterSocials/>
          <div className={styles.flex_links_payment}>
            <FooterLinks/>

            <div>
              <FooterPayments/>
              <FooterCertificate/>
            </div>
          </div>

          <FooterBot/>
        </div>
    </div>
  )
}

export default Footer