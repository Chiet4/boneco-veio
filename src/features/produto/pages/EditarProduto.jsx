// src/features/produto/pages/EditarProduto.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProdutoForm from "../components/ProdutoForm/ProdutoForm";
import useProdutos from "../hooks/useProdutos";
import { adminGetProdutoPorId } from "../services/produtoAdminService"; // <— usa o admin
import Carregar from "../../../components/common/Carregar/Carregar";

export default function EditarProduto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { editarProduto, carregarProdutos } = useProdutos();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroLoad, setErroLoad] = useState("");

  useEffect(() => {
    let ativo = true;
    if (!id) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        const dados = await adminGetProdutoPorId(id);
        if (!ativo) return;
        setProduto(dados);
        setCarregando(false);
      } catch (e) {
        console.error("Falha ao carregar produto:", e?.response?.data || e);
        if (!ativo) return;
        setErroLoad("Não foi possível carregar o produto.");
        setCarregando(false);
        // NÃO navegar automaticamente; deixe o usuário decidir voltar
      }
    })();

    return () => {
      ativo = false;
    };
  }, [id, navigate]);

  const handleSubmit = async (produtoData) => {
    try {
      await editarProduto(id, produtoData); // chama adminAtualizar por baixo (seu hook)
      await carregarProdutos();
      navigate("/produtos", {
        state: { mensagem: "Produto atualizado com sucesso!" },
      });
    } catch (error) {
      console.error("Erro ao salvar:", error?.response?.data || error);
      // ProdutoForm já mostra snackbar; aqui só logamos
    }
  };

  if (carregando) return <Carregar />;

  if (erroLoad) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>{erroLoad}</p>
        <button onClick={() => navigate("/produtos")}>Voltar</button>
      </div>
    );
  }

  if (!produto) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Produto não encontrado.</p>
        <button onClick={() => navigate("/produtos")}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <ProdutoForm
        initialData={produto}
        modoEdicao
        onSubmit={handleSubmit}
        onCancel={() => navigate("/produtos")}
      />
    </div>
  );
}
