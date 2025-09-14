import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProdutoForm from "../components/ProdutoForm/ProdutoForm";
import useProdutos from "../hooks/useProdutos";
import { Snackbar, Alert } from "@mui/material";

export default function CadastrarProduto() {
  const navigate = useNavigate();
  const { adicionarProduto, carregarProdutos } = useProdutos();

  // Estado local do Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Exibir Snackbar com mensagem personalizada
  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Fechar Snackbar
  const handleFecharSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Lógica de envio do formulário
  const handleSubmit = async (produtoData) => {
    try {
      await adicionarProduto(produtoData);
      await carregarProdutos();
      mostrarSnackbar("Produto cadastrado com sucesso!");
    } catch (error) {
      mostrarSnackbar("Erro ao cadastrar produto.", "error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <ProdutoForm
        modoEdicao={false}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/produtos")}
      />

      {/* Snackbar com estilo idêntico ao da Prateleira */}
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
