import React from 'react'
import styles from './Footer.module.css'

const FooterLinks = () => {
  return (
    <>
        <section className={styles.links_sec}>
            <div className={styles.links_container}>
                <div>
                    <h2>Sobre a Boneco Veio</h2>

                    <ul>
                        <li><a href="#">Quem somos</a></li>
                        <li><a href="#">Eventos</a></li>
                        <li><a href="#">Trabalhe conosco</a></li>
                        <li><a href="#">Loja física</a></li>
                        <li><a href="#">Vale-presente</a></li>
                    </ul>
                </div>
                <div>
                    <h2>Atendimento ao cliente</h2>

                    <ul>
                        <li><a href="#">Entre em contato</a></li>
                        <li><a href="#">Política de privacidade</a></li>
                        <li><a href="#">Política de entrega e devolução</a></li>
                        <li><a href="#">Política de vendas</a></li>
                        <li><a href="#">Perguntas e respostas</a></li>
                        <li><a href="#">Reclame Aqui</a></li>
                    </ul>
                </div>
                <div>
                    <h2>Serviços</h2>

                    <ul>
                        <li><a href="#">Solicitação de eventos</a></li>
                        <li><a href="#">Turismo</a></li>
                        <li><a href="#">Cursos</a></li>
                        <li><a href="#">Presentes ornamentados</a></li>
                    </ul>
                </div>
            </div>
        </section>
    </>
  )
}

export default FooterLinks