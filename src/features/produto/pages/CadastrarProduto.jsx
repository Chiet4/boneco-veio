// src/features/produto/pages/CadastrarProduto.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProdutoForm from "../components/ProdutoForm/ProdutoForm";
import useProdutos from "../hooks/useProdutos";
import { Snackbar, Alert } from "@mui/material";

export default function CadastrarProduto() {
  const navigate = useNavigate();
  const { adicionarProduto, carregarProdutos } = useProdutos();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFecharSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (produtoData) => {
    try {
      // produtoData já vem montado pelo useProdutoForm (imageSrc/title/description/originalPrice/discount/isNew/rating/stock)
      await adicionarProduto(produtoData);  // -> POST /admin/produtos
      await carregarProdutos();             // atualiza a listagem

      // Redireciona para a prateleira ADMIN com mensagem (sua Prateleira já consome location.state.mensagem)
      navigate("/produtos", {
        state: { mensagem: "Produto cadastrado com sucesso!" },
      });
    } catch (error) {
      // Tenta extrair mensagem do backend (Zod 422, etc.)
      const backendMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao cadastrar produto.";
      mostrarSnackbar(backendMsg, "error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <ProdutoForm
        modoEdicao={false}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/produtos")}
        // onSubmitCallback opcional: o hook já dispara snackbar interno no sucesso
      />

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
    </div>
  );
}
