// src/hooks/useProdutos.js
import { useState, useEffect } from "react";
import {
  listarProdutos,
  getProdutoPorId,
} from "../services/api";
import {
  adminCriarProduto,
  adminAtualizarProduto,
  adminRemoverProduto,
} from "../services/produtoAdminService";

const useProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarProdutos = async (params) => {
    try {
      setLoading(true);
      const lista = await listarProdutos(params);
      setProdutos(lista);
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
      throw erro;
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = async (novoProduto) => {
    try {
      const criado = await adminCriarProduto(novoProduto);
      setProdutos((prev) => [criado, ...prev]);
      return criado;
    } catch (erro) {
      console.error("Erro ao adicionar produto:", erro);
      throw erro;
    }
  };

  const editarProduto = async (id, dadosAtualizados) => {
    try {
      const atualizado = await adminAtualizarProduto(id, dadosAtualizados);
      setProdutos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...atualizado } : p))
      );
      return atualizado;
    } catch (erro) {
      console.error("Erro ao editar produto:", erro);
      throw erro;
    }
  };

  const deletarProduto = async (id) => {
    try {
      await adminRemoverProduto(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar produto:", erro);
      throw erro;
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  return {
    produtos,
    loading,
    carregarProdutos,
    getProdutoPorId,  // útil em páginas de detalhe/edição
    adicionarProduto,
    editarProduto,
    deletarProduto,
  };
};

export default useProdutos;
