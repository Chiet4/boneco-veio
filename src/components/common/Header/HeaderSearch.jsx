import React from 'react'
import styles from './Header.module.css';
import logo from '../../../assets/image/logoveio.png'
// import logo from '../../assets/image/logoveio.png'
import { Link } from 'react-router-dom';

const HeaderSearch = () => {
  return (
    <>
        <section className={styles.header_sec}>
            <div className={styles.header_container}>
                <div className={styles.header_logo}>
                    <a href="/">
                        <img src={logo} alt="Logo Boneco Veio" />
                        </a>
                </div>

                <div className={styles.header_searchbar}>
                    <select name="" id="">
                        <option value="tudo">Todo o Site</option>
                        <option value="históricos">Personagens Históricos</option>
                        <option value="popular">Cultura Popular</option>
                        <option value="paisagens">Paisagens</option>
                    </select>

                    <input type="search" name="searchbar" id="searchbar" />
                    <span>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>

                <div className={styles.header_account}>
                    <div className={styles.user_icon}>
                        <i className="fa-solid fa-user"></i>
                    </div>

                    <div className={styles.account}>
                        <span>Olá, bem vindo(a)!</span>
                        <Link to="/login">Entre ou cadastre-se</Link>
                    </div>
                </div>

                {/*<div className={styles.cart}>
                    <Link to="/carrinho">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </Link>
                </div>*/}
            </div>
        </section>
    </>
  )
}

export default HeaderSearch