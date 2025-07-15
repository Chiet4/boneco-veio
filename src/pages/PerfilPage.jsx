import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './PerfilPage.module.css';
// No futuro, o logo virá dos assets do projeto
// import logoBranco from '../../assets/logo-branco.svg';

export default function PerfilPage() {
  // Dados fictícios para a representação estática
  const user = {
    nome: 'David',
    nomeCompleto: 'David Ferreira',
    email: 'david@gmail.com',
    username: '@david.ferreira',
    avatarInitial: 'D'
  };

  return (
    <>
    <Header />
    <div className={styles.paginaPerfil}>
      {/* BLOCO 1: BANNER SUPERIOR */}
      <header className={styles.banner}>
        <div className={styles.logoBanner}>
          {/* Deixei um placeholder para a imagem do logo, mas talvez não precise */}
          {/* <img src={logoBranco} alt="Logo Boneco Véio" /> */}
          <h1 className={styles.logoTexto}>BONECO *Véio!*</h1>
        </div>
        <div className={styles.bannerTexto}>
          <h2>Olá, {user.nome}!</h2>
          <p>Gerencie tudo que importa em um só lugar: informações pessoais, pedidos e segurança.</p>
        </div>
      </header>

      <main className={styles.conteudo}>
        <div className={styles.avatar}>
          <span>{user.avatarInitial}</span>
        </div>

        {/* BLOCO 2: MEUS PEDIDOS */}
        <section className={styles.cardSecao}>
          <h3 className={styles.tituloSecao}>Meus Pedidos</h3>
          {/* Abaixo está o espaço editável para o card do pedido */}
          <div className={styles.pedidoItem}>
            <div className={styles.pedidoHeader}>
              <div><span>PEDIDO REALIZADO</span>18 de junho de 2025</div>
              <div><span>TOTAL</span>R$ 169,99</div>
              <div><span>ENVIAR PARA</span>{user.nome}</div>
              <div><span>PEDIDO Nº</span>702-209441</div>
            </div>
            <div className={styles.pedidoBody}>
              <div className={styles.produtoInfo}>
                <img 
                  src="src/assets/image/15.webp" // Placeholder para a imagem do produto
                  alt="Nome do Produto" 
                  className={styles.produtoImagem}
                />
                <div>
                  <p className={styles.entregaStatus}>Chega entre os dias 14 julho e 22 julho</p>
                  <p className={styles.produtoNome}>Yorge Ruiz e Jaspe - Arte Viva de Fortaleza</p>
                </div>
              </div>
              <div className={styles.pedidoAcoes}>
                <button className={`${styles.btn} ${styles.btnPrimario}`}>Rastrear pacote</button>
                <button className={`${styles.btn} ${styles.btnSecundario}`}>Problema com o pedido</button>
              </div>
            </div>
          </div>
           {/* Pode adicionar mais blocos .pedidoItem aqui para mais pedidos */}
        </section>

        {/* BLOCO 3: INFORMAÇÕES PESSOAIS */}
        <section className={styles.cardSecao}>
          <div className={styles.cardHeader}>
            <h3 className={styles.tituloSecao}>Informações pessoais</h3>
            <button className={`${styles.btn} ${styles.btnEditar}`}>Editar</button>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}><span>Nome social (público)</span>{user.nome}</div>
            <div className={styles.infoItem}><span>Nome completo</span>{user.nomeCompleto}</div>
            <div className={styles.infoItem}><span>E-mail</span>{user.email}</div>
            <div className={styles.infoItem}><span>Usuário</span>{user.username}</div>
          </div>
        </section>

        {/* Futuramente, aqui entrariam as outras seções como Configurações e Segurança */}
      </main>
    </div>
    <Footer />
    </>
  );
}