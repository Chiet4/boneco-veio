// src/features/produto/services/adminPedidosService.js
import api from "../../services/api";

export const ADMIN_ORDER_STATUSES = ["pendente", "pago", "enviado", "cancelado"];

export function normalizeAdminOrder(o) {
  return {
    id: o.id,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    user: o.user ? { id: o.user.id, name: o.user.name, email: o.user.email } : null,
    items: Array.isArray(o.items)
      ? o.items.map((it) => ({
          id: it.id,
          productId: it.productId,
          title: it.titleSnapshot,
          price: it.priceSnapshot,
          image: it.imageSnapshot,
          quantity: it.quantity,
          subtotal: Number((it.priceSnapshot * it.quantity).toFixed(2)),
          product: it.product
            ? { id: it.product.id, title: it.product.title, imageSrc: it.product.imageSrc }
            : null,
        }))
      : [],
  };
}

export async function listarPedidos() {
  const resp = await api.get("/admin/pedidos", {
    // se vier 3xx ainda resolve; 4xx/5xx vai lançar no catch normal
    validateStatus: (s) => s >= 200 && s < 400,
  });

  // Diagnóstico: se não for JSON, provavelmente bateu no Vite (HTML)
  const ct = (resp.headers && resp.headers["content-type"]) || "";
  if (!ct.includes("application/json")) {
    const url = resp?.request?.responseURL || "(desconhecida)";
    throw new Error(
      `Esperava JSON mas recebi '${ct}'. A requisição provavelmente foi para ${url}. ` +
      `Verifique baseURL e se o caminho é http://localhost:3333/admin/pedidos.`
    );
  }

  let data = resp.data;

  // aceita array direto
  if (Array.isArray(data)) return data.map(normalizeAdminOrder);

  // fallback: { items: [...] }
  if (data && Array.isArray(data.items)) return data.items.map(normalizeAdminOrder);

  // se for string, é HTML do Vite
  if (typeof data === "string") {
    throw new Error("Recebi HTML (Vite) em vez de JSON. O baseURL não está sendo aplicado.");
  }

  throw new Error("Resposta inesperada da API em /admin/pedidos");
}

export async function atualizarStatus(orderId, status) {
  if (!ADMIN_ORDER_STATUSES.includes(status)) {
    throw new Error("Status inválido");
  }
  const resp = await api.patch(`/admin/pedidos/${orderId}/status`, { status });
  return normalizeAdminOrder(resp.data);
}
