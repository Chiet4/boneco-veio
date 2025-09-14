
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProdutoPorId } from "../services/api";
import styles from "./ProdutoDetalhePage.module.css";

export default function ProdutoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const dados = await getProdutoPorId(id);
        setProduto(dados);
      } catch (erro) {
        console.error("Produto não encontrado:", erro);
      } finally {
        setCarregando(false);
      }
    }

    fetchProduto();
  }, [id]);

  if (carregando) return <p>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado.</p>;

  const precoComDesconto = produto.discount
    ? (produto.price * (1 - produto.discount / 100)).toFixed(2)
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.voltarContainer}>
        <button onClick={() => navigate("/")} aria-label="Voltar para página inicial">
          ← Voltar
        </button>
      </div>

      <div className={styles.cardDetalhado}>
        <img
          src={produto.imageSrc || "/fallback.jpg"}
          alt={`Imagem do produto ${produto.title}`}
          className={styles.imagemGrande}
          onError={(e) => (e.target.src = "/fallback.jpg")}
        />

        <div className={styles.info}>
          <h1>{produto.title}</h1>
          <p>{produto.description}</p>

          {produto.discount ? (
            <>
              <p>
                <strong>Preço original:</strong> R$ {produto.price}
              </p>
              <p>
                <strong>Desconto:</strong> {produto.discount}%
              </p>
              <p>
                <strong>Preço com desconto:</strong> R$ {precoComDesconto}
              </p>
            </>
          ) : (
            <p>
              <strong>Preço:</strong> R$ {produto.price}
            </p>
          )}

          {produto.rating && (
            <p className={styles.avaliacao}>
              <strong>Avaliação:</strong> {produto.rating} estrelas
            </p>
          )}

          <div className={styles.chipGroup}>
            {produto.isNew && <span className={styles.chip}>Novidade</span>}
            {produto.isFavorite && <span className={styles.chip}>Favorito</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
