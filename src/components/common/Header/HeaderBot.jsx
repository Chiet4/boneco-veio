import React from 'react'
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const HeaderBot = () => {
  return (
    <>
        <section className={styles.headerbot_section}>
            <div className={styles.headerbot_container}>
                <nav>
                    <ul>
                        <li>
                            <Link to="/notfound" className={styles.links}>Atendimento e Televendas</Link>
                        </li>
                        <li>
                            <Link to="/notfound" className={styles.links}>Atendimento Empresas</Link>
                        </li>
                        <li>
                            <Link to="/notfound" className={styles.links}>Encomendas Personalizadas</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    </>
  )
}

export default HeaderBot