import { useEffect, useState, useCallback, useMemo } from "react";
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import {
  listarPedidos,
  atualizarStatus,
  ADMIN_ORDER_STATUSES,
} from "../../features/pedidos/adminPedidosService";

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [selecionadoId, setSelecionadoId] = useState(null);

  const pedidoSelecionado = useMemo(
    () => pedidos.find((p) => p.id === selecionadoId) || null,
    [pedidos, selecionadoId]
  );

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setErro("");
      const itens = await listarPedidos();
      setPedidos(itens);
    } catch (e) {
      console.error(e);
      setErro("Falha ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selecionadoId) return; // se estiver no detalhe, não recarrega
    fetchPedidos();
  }, [fetchPedidos, selecionadoId]);

  async function handleChangeStatus(orderId, newStatus) {
    try {
      setErro("");
      const atualizado = await atualizarStatus(orderId, newStatus);
      setPedidos((old) => old.map((p) => (p.id === orderId ? atualizado : p)));
      if (selecionadoId === orderId) {
        setSelecionadoId(orderId); // força re-render do detalhe
      }
    } catch (e) {
      console.error(e);
      setErro("Não foi possível atualizar o status.");
    }
  }

  return (
    <>
      <Header />

      <main className="container" style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Lista de Pedidos (Admin)</h1>
        </div>

        {!selecionadoId ? (
          <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 24 }}>Carregando pedidos…</div>
            ) : erro ? (
              <div style={{ padding: 24, color: "#b00020" }}>{erro}</div>
            ) : pedidos.length === 0 ? (
              <div style={{ padding: 24 }}>Nenhum pedido encontrado.</div>
            ) : (
              <div style={{ width: "100%", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
                    <tr>
                      <th style={thStyle}>#ID</th>
                      <th style={thStyle}>Cliente</th>
                      <th style={thStyle}>Itens</th>
                      <th style={thStyle}>Total</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Criado em</th>
                      <th style={thStyle}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={tdStyle} title={p.id}>{encurta(p.id)}</td>
                        <td style={tdStyle}>
                          {p.user ? (
                            <>
                              <div style={{ fontWeight: 600 }}>{p.user.name || "—"}</div>
                              <div style={{ fontSize: 12, color: "#666" }}>{p.user.email}</div>
                            </>
                          ) : "—"}
                        </td>
                        <td style={tdStyle}>{p.items?.length ?? 0}</td>
                        <td style={tdStyle}>
                          {p.total != null ? p.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                        </td>
                        <td style={tdStyle}>
                          <StatusBadge status={p.status} />
                          <div style={{ marginTop: 6 }}>
                            <select
                              value={p.status}
                              onChange={(e) => handleChangeStatus(p.id, e.target.value)}
                              style={selectStyle}
                            >
                              {ADMIN_ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          {p.createdAt ? new Date(p.createdAt).toLocaleString("pt-BR") : "—"}
                        </td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => setSelecionadoId(p.id)}
                            style={buttonPrimary}
                            title="Ver detalhes"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <PedidoDetalhe
            pedido={pedidoSelecionado}
            onVoltar={() => setSelecionadoId(null)}
            onChangeStatus={(status) => handleChangeStatus(pedidoSelecionado.id, status)}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

function StatusBadge({ status }) {
  const map = {
    pendente: { bg: "#fff8e1", bd: "#ffe082", fg: "#7a5d00" },
    pago: { bg: "#e8f5e9", bd: "#c8e6c9", fg: "#1b5e20" },
    enviado: { bg: "#e3f2fd", bd: "#bbdefb", fg: "#0d47a1" },
    cancelado: { bg: "#ffebee", bd: "#ffcdd2", fg: "#b71c1c" },
  };
  const style = map[status] || { bg: "#eee", bd: "#ddd", fg: "#444" };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 12,
      background: style.bg,
      border: `1px solid ${style.bd}`,
      color: style.fg,
      textTransform: "capitalize",
    }}>
      {status}
    </span>
  );
}

function PedidoDetalhe({ pedido, onVoltar, onChangeStatus }) {
  if (!pedido) {
    return (
      <section style={{ marginTop: 16 }}>
        <button onClick={onVoltar} style={buttonGhost}>← Voltar</button>
        <div style={{ padding: 24 }}>Pedido não encontrado.</div>
      </section>
    );
  }

  const totalCalc = (pedido.items || []).reduce((acc, it) => acc + it.subtotal, 0);

  return (
    <section style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <button onClick={onVoltar} style={buttonGhost}>← Voltar</button>
          <h2 style={{ margin: "12px 0 0 0" }}>Pedido {encurta(pedido.id)} </h2>
          <div style={{ color: "#666", fontSize: 14 }}>
            Criado em: {pedido.createdAt ? new Date(pedido.createdAt).toLocaleString("pt-BR") : "—"}
          </div>
        </div>
        <div>
          <StatusBadge status={pedido.status} />
          <div style={{ marginTop: 6 }}>
            <select value={pedido.status} onChange={(e) => onChangeStatus(e.target.value)} style={selectStyle}>
              {ADMIN_ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
              <tr>
                <th style={thStyle}>Produto</th>
                <th style={thStyle}>Preço</th>
                <th style={thStyle}>Qtd</th>
                <th style={thStyle}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(pedido.items || []).map((it) => (
                <tr key={it.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {it.image ? (
                        <img src={it.image} alt={it.title} width={48} height={48}
                          style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} />
                      ) : null}
                      <div>
                        <div style={{ fontWeight: 600 }}>{it.title}</div>
                        {it.product?.title ? (
                          <div style={{ fontSize: 12, color: "#666" }}>Catálogo: {it.product.title}</div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>{it.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td style={tdStyle}>{it.quantity}</td>
                  <td style={tdStyle}>{it.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>Total (recalculado)</td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>
                  {totalCalc.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={{ ...tdStyle, textAlign: "right", color: "#666" }}>Total (API)</td>
                <td style={{ ...tdStyle, color: "#666" }}>
                  {pedido.total != null ? pedido.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------------- estilos utilitários ---------------- */
const thStyle = { textAlign: "left", padding: "12px 16px", fontWeight: 600, fontSize: 13, color: "#444" };
const tdStyle = { padding: "12px 16px", fontSize: 14, color: "#333", verticalAlign: "middle" };
const selectStyle = { padding: "6px 8px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" };
const buttonPrimary = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #0e6b50",
  background: "#10836a",
  color: "#fff",
  cursor: "pointer",
};
const buttonGhost = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#333",
  cursor: "pointer",
};

function encurta(id) {
  if (!id) return "—";
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
}
