// src/services/produtoService.js
import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:3333",
});

export function normalizeProduct(p) {
  return {
    id: p.id,
    imageSrc: p.imageSrc,
    title: p.title,
    description: p.description,
    originalPrice: p.originalPrice,
    price: p.price,
    discount: p.discount ?? null,
    stock: p.stock ?? 0,
    rating: typeof p.rating === "number" ? p.rating : 0,
    isNew: Boolean(p.isNew),
    isFavorite: typeof p.isFavorite === "boolean" ? p.isFavorite : false,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function listarProdutos(params = {}) {
  const resp = await api.get("/produtos", { params });
  const data = resp.data;

  if (Array.isArray(data)) return data.map(normalizeProduct);
  if (data && Array.isArray(data.items)) return data.items.map(normalizeProduct);
  return [];
}

export async function getProdutoPorId(id) {
  const resp = await api.get(`/produtos/${id}`);
  return normalizeProduct(resp.data);
}
