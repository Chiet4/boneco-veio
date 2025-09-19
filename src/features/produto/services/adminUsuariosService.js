import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

// Normaliza usuário para uso no front
export function normalizeAdminUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role, // "ADMIN" | "USER"
    createdAt: u.createdAt,
  };
}

/**
 * Lista usuários do endpoint /admin/usuarios
 * O back retorna: { items: [...], total, page, perPage }
 */
export async function listarUsuarios(params = {}) {
  const resp = await api.get("/admin/usuarios", { params });
  const data = resp.data;

  return {
    items: Array.isArray(data.items) ? data.items.map(normalizeAdminUser) : [],
    total: data.total ?? 0,
    page: data.page ?? 1,
    perPage: data.perPage ?? 12,
  };
}

export async function getUsuarioPorId(id) {
  const resp = await api.get(`/admin/usuarios/${id}`);
  return normalizeAdminUser(resp.data);
}
