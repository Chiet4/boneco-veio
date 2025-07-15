import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import styles from './CarrinhoPage.module.css';

export default function CarrinhoPage() {
  const { cartItems } = useCart();

  // Calcula o subtotal sempre que o carrinho mudar.
  // useMemo evita recálculos desnecessários, otimizando a performance.
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const frete = 10.00; // Valor de frete fixo por enquanto
  const total = subtotal + frete;

  return (
    <>
    <Header />
    <div className={styles.paginaCarrinho}>
      <main className={styles.conteudoPrincipal}>
        {/* COLUNA DA ESQUERDA: ITENS */}
        <div className={styles.listaContainer}>
          <h2 className={styles.tituloSecao}>Todos os itens</h2>
          
          {cartItems.length === 0 ? (
            <p>O seu carrinho está vazio.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <img src={item.imageSrc} alt={item.title} className={styles.imagemItem} />
                <div className={styles.infoItem}>
                  <h3>{item.title}</h3>
                  <p>R$ {item.price.toFixed(2)}</p>
                </div>
                <div className={styles.quantidadeControl}>
                  <button>-</button>
                  <span>{item.quantity}</span>
                  <button>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* COLUNA DA DIREITA: RESUMO */}
        <aside className={styles.resumoContainer}>
          <h2 className={styles.tituloSecao}>Resumo</h2>
          <div className={styles.detalheResumo}>
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.detalheResumo}>
            <span>Entrega</span>
            <span>R$ {frete.toFixed(2)}</span>
          </div>
          <hr className={styles.divisor} />
          <div className={`${styles.detalheResumo} ${styles.total}`}>
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button className={styles.botaoFinalizar}>FINALIZAR COMPRA</button>
        </aside>
      </main>
    </div>
    <Footer />
    </>
  );
}