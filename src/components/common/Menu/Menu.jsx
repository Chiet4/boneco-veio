import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Menu.module.css';

const Menu = () => {
  const url = useLocation().pathname;

  const [menuAtivo, setMenuAtivo] = useState(false);

  const handleMenu = () => {
    setMenuAtivo(prev => !prev)
  }

  const handleCloseMenu = () => {
    setMenuAtivo(false)
  }

  return (
    <section className={styles.menu_sec}>
      <div className={styles.menu_bars}  onClick={handleMenu}>
        <i className="fa-solid fa-bars"></i>
      </div>
      <div className={styles.menu_container}>
        <nav className={menuAtivo === true ? `${styles.menu_nav} ${styles.active}` : styles.menu_nav}>
          {/* <Link to="/"  onClick={handleCloseMenu} className={`${styles.links_menu} ${url === '/' ? styles.current_page : ''}`}>Home</Link> */}
          <Link to="/produtos"  onClick={handleCloseMenu} className={`${styles.links_menu} ${url === '/produtos' ? styles.current_page : ''}`}>Produtos</Link>
          <Link to="/perfil" onClick={handleCloseMenu} className={`${styles.links_menu} ${url === '/perfil' ? styles.current_page : ''}`}>Perfil</Link>
          <Link to="/pedidos" onClick={handleCloseMenu} className={`${styles.links_menu} ${url === '/pedidos' ? styles.current_page : ''}`}>Pedidos</Link>
          <Link to="/rastreio" onClick={handleCloseMenu} className={`${styles.links_menu} ${url === '/rastreio' ? styles.current_page : ''}`}>Usuários</Link>
          <Link to="/contato" onClick={handleCloseMenu} className={`${styles.links_menu} ${url === '/contato' ? styles.current_page : ''}`}>Contato</Link>
          <Link to="/endereco" onClick={handleCloseMenu} className={`${styles.links_menu} ${url === '/endereco' ? styles.current_page : ''}`}>Endereço</Link>
        </nav>
      </div>
    </section>
  );
};

export default Menu;
