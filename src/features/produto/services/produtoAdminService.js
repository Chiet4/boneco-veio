import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:3333",
  // withCredentials: true, // quando ligar auth por cookie
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
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function adminCriarProduto(payload) {
  const resp = await api.post("/admin/produtos", payload);
  return normalizeProduct(resp.data);
}

export async function adminAtualizarProduto(id, patch) {
  const resp = await api.patch(`/admin/produtos/${id}`, patch);
  return normalizeProduct(resp.data);
}

export async function adminRemoverProduto(id) {
  await api.delete(`/admin/produtos/${id}`);
}

export async function adminGetProdutoPorId(id) {
  const resp = await api.get(`/produtos/${id}`); // detalhe público já existe
  return normalizeProduct(resp.data);
}
