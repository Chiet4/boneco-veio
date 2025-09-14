import Header from '../../../components/common/Header/Header';
import Footer from '../../../components/common/Footer/Footer';
import styles from '../styles/PerfilPage.module.css'; // Ajustado para o caminho correto

// Não precisamos mais da imagem do produto, então o import foi removido.

export default function PerfilPage() {
  // 1. Trocamos os dados do usuário pelos dados da empresa
  const empresa = {
    nome: 'Boneco Véio! S/A',
    email: 'contato@bonecoveio.com',
    endereco: 'Av. Dr. Silas Munguba, 1700 - Itaperi, Fortaleza - CE, CEP 60714-903',
    cnpj: '14.507.434/0001-97 (fictício)',
    avatarInitial: 'BV'
  };

  return (
    <>
      <Header />
      <div className={styles.paginaPerfil}>
        {/* 2. Ajustamos o banner para uma mensagem de admin */}
        <header className={styles.banner}>
          <div className={styles.logoBanner}>
            <h1 className={styles.logoTexto}>BONECO *Véio!*</h1>
          </div>
          <div className={styles.bannerTexto}>
            <h2>Painel Administrativo</h2>
            <p>Gerenciamento de dados e informações da loja {empresa.nome}.</p>
          </div>
        </header>

        <main className={styles.conteudo}>
          <div className={styles.avatar}>
            <span>{empresa.avatarInitial}</span>
          </div>

          {/* 3. A seção "Meus Pedidos" foi completamente REMOVIDA */}

          {/* 4. A seção "Informações Pessoais" foi transformada em "Informações da Empresa" */}
          <section className={styles.cardSecao}>
            <div className={styles.cardHeader}>
              <h3 className={styles.tituloSecao}>Informações da Empresa</h3>
              {/* O botão de editar foi removido */}
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><span>Nome Fantasia</span>{empresa.nome}</div>
              <div className={styles.infoItem}><span>E-mail de Contato</span>{empresa.email}</div>
              <div className={styles.infoItem}><span>Endereço</span>{empresa.endereco}</div>
              <div className={styles.infoItem}><span>CNPJ</span>{empresa.cnpj}</div>
            </div>
          </section>

        </main>
      </div>
      <Footer />
    </>
  );
}