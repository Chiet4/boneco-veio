import React from 'react'
import styles from './Footer.module.css'

const FooterSocials = () => {
  return (
    <>
        <section className={styles.socials_sec}>
            <div className={styles.socials_container}>
                <h3>Redes Sociais</h3>

                <div className={styles.socials_links}>
                    <ul>
                        <li>
                            <a href="https://www.instagram.com/" target='_blank'>
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/" target='_blank'>
                                <i className="fa-brands fa-facebook"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/" target='_blank'>
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tiktok.com/" target='_blank'>
                                <i className="fa-brands fa-tiktok"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </>
  )
}

export default FooterSocials