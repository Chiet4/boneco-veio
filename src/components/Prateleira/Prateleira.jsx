import {useEffect, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import CardDisplay from "../CardDisplay/CardDisplay";
import ErrorBoundary from "../ErrorBoundary";
import useProdutos from "../../hooks/useProdutos";
import styles from "./Prateleira.module.css";
import { useCart } from "../../context/CartContext";

export default function Prateleira() {
  const navigate = useNavigate();
  const { produtos, editarProduto, deletarProduto } = useProdutos();
  const { addToCart } = useCart();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const mostrarSnackbar = (mensagem, tipo = "success") =>
    setSnackbar({ open: true, message: mensagem, severity: tipo });

  const handleFecharSnackbar = () =>
    setSnackbar((estadoAnterior) => ({ ...estadoAnterior, open: false }));

  const handleAdicionarClick = useCallback(() => {
    navigate("/produto/novo");
  }, [navigate]);

  const handleEditarProduto = useCallback(
    (produtoId) => {
      navigate(`/produto/editar/${produtoId}`);
    },
    [navigate]
  );

  const handleExcluirProduto = useCallback(
    async (idProduto) => {
      try {
        await deletarProduto(idProduto);
        mostrarSnackbar("Produto excluído com sucesso.");
      } catch {
        mostrarSnackbar("Erro ao excluir produto.", "error");
      }
    },
    [deletarProduto]
  );

  const handleVoltarHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const atualizarProduto = useCallback(
    async (idProduto, novosDados, mensagemSucesso, mensagemErro) => {
      try {
        await editarProduto(idProduto, novosDados);
        mostrarSnackbar(mensagemSucesso);
      } catch {
        mostrarSnackbar(mensagemErro, "error");
      }
    },
    [editarProduto]
  );

  const handleAlternarFavorito = useCallback(
    (idProduto) => {
      const produto = produtos.find((p) => p.id === idProduto);
      if (produto) {
        atualizarProduto(
          idProduto,
          { ...produto, isFavorite: !produto.isFavorite },
          "Favorito atualizado!",
          "Erro ao favoritar produto."
        );
      }
    },
    [produtos, atualizarProduto]
  );

  const handleAlterarNota = useCallback(
    (idProduto, novaNota) => {
      const produto = produtos.find((p) => p.id === idProduto);
      if (produto) {
        atualizarProduto(
          idProduto,
          { ...produto, rating: novaNota },
          "Nota atualizada!",
          "Erro ao avaliar o produto."
        );
      }
    },
    [produtos, atualizarProduto]
  );

  const location = useLocation();
  useEffect(() => {
      if (location.state?.mensagem) {
        mostrarSnackbar(location.state.mensagem, location.state.tipo || "success");
        window.history.replaceState({}, document.title); // limpa state
      }
    }, [location.state]);

  return (
    <ErrorBoundary>
      {/* Cabeçalho */}
      <div className={styles.header}>
        {/* <button className={styles.btnVoltar} onClick={handleVoltarHome}>
          ⬅ Voltar para Home
        </button> */}
        <button className={styles.btnAdicionar} onClick={handleAdicionarClick}>
          + Adicionar Produto
        </button>
      </div>

      {/* Lista de produtos */}
      <div className={styles.container}>
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <CardDisplay
              key={produto.id}
              {...produto}
              onEditClick={() => handleEditarProduto(produto.id)}
              onDeleteClick={() => handleExcluirProduto(produto.id)}
              onToggleFavorite={() => handleAlternarFavorito(produto.id)}
              onSetRating={(valor) => handleAlterarNota(produto.id, valor)}
              onBuyClick={() => console.log("Comprar clicado")}
              onCartClick={() => {
                addToCart(produto);
                mostrarSnackbar("Produto adicionado ao carrinho!");
              }}

            />
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleFecharSnackbar}
      >
        <Alert onClose={handleFecharSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ErrorBoundary>
  );
}
