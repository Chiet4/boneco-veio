// src/components/Prateleira/Prateleira.jsx
import React, { useState, useCallback, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import CardDisplay from "../CardDisplay/CardDisplay";
import useProdutos from "../../hooks/useProdutos";
import styles from "./Prateleira.module.css";
import { useCart } from "../../../../context/CartContext";

export default function Prateleira() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin"); // <-- chave
  const { produtos, editarProduto, deletarProduto } = useProdutos();
  const { addToCart } = useCart();

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const exibirSnackbar = (mensagem, tipo = "success") => {
    setSnackbar({ open: true, message: mensagem, severity: tipo });
  };

  const handleFecharSnackbar = () => {
    setSnackbar((estadoAnterior) => ({ ...estadoAnterior, open: false }));
  };

  useEffect(() => {
    const handleMensagemDeRota = () => {
      if (location.state?.mensagem) {
        exibirSnackbar(location.state.mensagem);
        window.history.replaceState({}, document.title);
      }
    };
    handleMensagemDeRota();
  }, [location.state]);

  // Adicionar
  const handleAdicionarClick = useCallback(() => {
    navigate("/admin/produtos/novo");
  }, [navigate]);

  // Editar
  const handleEditarProduto = useCallback(
    (produtoId) => {
      navigate(`/admin/produtos/editar/${produtoId}`);
    },
    [navigate]
  );

  // Excluir
  const handleExcluirProduto = useCallback(
    async (idProduto) => {
      try {
        await deletarProduto(idProduto);
        exibirSnackbar("Produto excluído com sucesso.");
      } catch {
        exibirSnackbar("Erro ao excluir produto.", "error");
      }
    },
    [deletarProduto]
  );

  // Atualizar (não usado no admin para favorito/nota)
  const atualizarProduto = useCallback(
    async (idProduto, patch, { sucesso, erro }) => {
      try {
        await editarProduto(idProduto, patch);
        exibirSnackbar(sucesso);
      } catch {
        exibirSnackbar(erro, "error");
      }
    },
    [editarProduto]
  );

  // Favorito (somente público; admin não usa)
  const handleAlternarFavorito = useCallback(
    (idProduto) => {
      if (isAdmin) return;
      atualizarProduto(
        idProduto,
        { isFavorite: true }, // placeholder: substituir quando ligar endpoint de favoritos
        {
          sucesso: "Favorito atualizado!",
          erro: "Erro ao favoritar produto.",
        }
      );
    },
    [isAdmin, atualizarProduto]
  );

  // Nota (somente público; admin não usa)
  const handleAlterarNota = useCallback(
    (idProduto, novaNota) => {
      if (isAdmin) return;
      atualizarProduto(
        idProduto,
        { rating: novaNota },
        {
          sucesso: "Nota atualizada!",
          erro: "Erro ao avaliar o produto.",
        }
      );
    },
    [isAdmin, atualizarProduto]
  );

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.btnAdicionar} onClick={handleAdicionarClick}>
          + Adicionar Produto
        </button>
      </div>

      {/* Lista */}
      <div className={styles.container}>
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <CardDisplay
              key={produto.id}
              {...produto}
              adminMode={isAdmin} // <-- mostra ações no hover
              disableNavigation={isAdmin} // <-- evita ir para /produtos/:id ao clicar no card
              onEditClick={() => handleEditarProduto(produto.id)}
              onDeleteClick={() => handleExcluirProduto(produto.id)}
              // Só passa interações públicas quando NÃO é admin
              {...(!isAdmin && {
                onToggleFavorite: () => handleAlternarFavorito(produto.id),
                onSetRating: (valor) => handleAlterarNota(produto.id, valor),
                onBuyClick: () => console.log("Comprar clicado"),
                onCartClick: () => addToCart(produto),
              })}
            />
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleFecharSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleFecharSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
