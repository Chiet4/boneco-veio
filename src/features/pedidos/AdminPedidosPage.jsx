import { useEffect, useMemo, useState, useCallback } from "react";
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import {
  listarPedidos,
  atualizarStatus,
  ADMIN_ORDER_STATUSES,
} from "../../features/pedidos/adminPedidosService";

/* ============================
   Utils
   ============================ */
const formatCurrency = (n) =>
  (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString("pt-BR") : "—");

// A11y: permite clicar/Enter/Espaço na linha
function rowA11yHandlers(onClick) {
  return {
    role: "button",
    tabIndex: 0,
    onClick,
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") onClick();
    },
    style: { cursor: "pointer" },
  };
}

/* ============================
   Estilos (centralizados)
   ============================ */
const pageContainer = { maxWidth: 1100, margin: "32px auto", padding: "0 16px" };
const titleBar = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" };

const card = { marginTop: 16, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" };
const tableWrap = { width: "100%", overflowX: "auto" };

const thBase = { textAlign: "left", padding: "12px 16px", fontWeight: 600, fontSize: 13, color: "#444" };
const thLeft = thBase;
const thRight = { ...thBase, textAlign: "right" };

const tdBase = { padding: "12px 16px", fontSize: 14, color: "#333", verticalAlign: "middle" };
const tdLeft = tdBase;
const tdRight = { ...tdBase, textAlign: "right" };

const selectStyle = { padding: "6px 8px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" };
const buttonGhost = { padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#333", cursor: "pointer" };

/* ============================
   Página
   ============================ */
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
    // confirmação apenas para cancelamento
    if (newStatus === "cancelado" && !confirm("Confirmar cancelamento do pedido?")) return;

    // optimistic update com rollback
    const prev = pedidos;
    setPedidos((old) => old.map((p) => (p.id === orderId ? { ...p, status: newStatus } : p)));
    try {
      const atualizado = await atualizarStatus(orderId, newStatus);
      setPedidos((old) => old.map((p) => (p.id === orderId ? atualizado : p)));
    } catch (e) {
      console.error(e);
      setPedidos(prev); // rollback
      alert("Não foi possível atualizar o status. Tente novamente.");
    }
  }

  return (
    <>
      <Header />
      <main className="container" style={pageContainer}>
        <div style={titleBar}>
          <h1 style={{ margin: 0, fontSize: 24 }}>Lista de Pedidos (Admin)</h1>
        </div>

        {/* LISTA (layout planilha, sem coluna de ID/Ações) */}
        {!selecionadoId ? (
          <section style={card}>
            {loading ? (
              <div style={{ padding: 24 }}>Carregando pedidos…</div>
            ) : erro ? (
              <div style={{ padding: 24, color: "#b00020" }}>{erro}</div>
            ) : pedidos.length === 0 ? (
              <div style={{ padding: 24 }}>Nenhum pedido encontrado.</div>
            ) : (
              <div style={tableWrap}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
                    <tr>
                      <th style={thLeft}>Cliente</th>
                      <th style={thRight}>Itens</th>
                      <th style={thRight}>Total</th>
                      <th style={thLeft}>Status</th>
                      <th style={thLeft}>Criado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr
                        key={p.id}
                        {...rowA11yHandlers(() => setSelecionadoId(p.id))}
                        style={{ borderBottom: "1px solid #f0f0f0" }}
                        title="Ver detalhes"
                      >
                        {/* Cliente */}
                        <td style={tdLeft}>
                          {p.user ? (
                            <>
                              <div style={{ fontWeight: 600 }}>{p.user.name || "—"}</div>
                              <div style={{ fontSize: 12, color: "#666" }}>{p.user.email}</div>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Itens */}
                        <td style={tdRight}>{p.items?.length ?? 0}</td>

                        {/* Total */}
                        <td style={tdRight}>{p.total != null ? formatCurrency(p.total) : "—"}</td>

                        {/* Status (badge + select). StopPropagation para não abrir detalhe ao clicar no select */}
                        <td style={tdLeft}>
                          <StatusBadge status={p.status} />
                          <div style={{ marginTop: 6 }}>
                            <select
                              value={p.status}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleChangeStatus(p.id, e.target.value);
                              }}
                              style={selectStyle}
                            >
                              {ADMIN_ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Criado em */}
                        <td style={tdLeft}>{formatDate(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          // DETALHE
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

/* ============================
   Componentes auxiliares
   ============================ */
function StatusBadge({ status }) {
  const map = {
    pendente: { bg: "#fff8e1", bd: "#ffe082", fg: "#7a5d00" },
    pago: { bg: "#e8f5e9", bd: "#c8e6c9", fg: "#1b5e20" },
    enviado: { bg: "#e3f2fd", bd: "#bbdefb", fg: "#0d47a1" },
    cancelado: { bg: "#ffebee", bd: "#ffcdd2", fg: "#b71c1c" },
  };
  const style = map[status] || { bg: "#eee", bd: "#ddd", fg: "#444" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        background: style.bg,
        border: `1px solid ${style.bd}`,
        color: style.fg,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

function PedidoDetalhe({ pedido, onVoltar, onChangeStatus }) {
  if (!pedido) {
    return (
      <section style={{ marginTop: 16 }}>
        <button onClick={onVoltar} style={buttonGhost}>
          ← Voltar
        </button>
        <div style={{ padding: 24 }}>Pedido não encontrado.</div>
      </section>
    );
  }

  const totalCalc = (pedido.items || []).reduce((acc, it) => acc + (it.subtotal ?? it.price * it.quantity), 0);

  return (
    <section style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <button onClick={onVoltar} style={buttonGhost}>
            ← Voltar
          </button>
          <h2 style={{ margin: "12px 0 0 0" }}>Detalhe do Pedido</h2>
          <div style={{ color: "#666", fontSize: 14 }}>Criado em: {formatDate(pedido.createdAt)}</div>
        </div>
        <div>
          <StatusBadge status={pedido.status} />
          <div style={{ marginTop: 6 }}>
            <select value={pedido.status} onChange={(e) => onChangeStatus(e.target.value)} style={selectStyle}>
              {ADMIN_ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={tableWrap}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
              <tr>
                <th style={thLeft}>Produto</th>
                <th style={thRight}>Preço</th>
                <th style={thRight}>Qtd</th>
                <th style={thRight}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(pedido.items || []).map((it) => (
                <tr key={it.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={tdLeft}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.title}
                          width={48}
                          height={48}
                          style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                        />
                      ) : null}
                      <div>
                        <div style={{ fontWeight: 600 }}>{it.title}</div>
                        {it.product?.title ? (
                          <div style={{ fontSize: 12, color: "#666" }}>Catálogo: {it.product.title}</div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td style={tdRight}>{formatCurrency(it.price)}</td>
                  <td style={tdRight}>{it.quantity}</td>
                  <td style={tdRight}>{formatCurrency(it.subtotal ?? it.price * it.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ ...tdRight, fontWeight: 700 }}>
                  Total (recalculado)
                </td>
                <td style={{ ...tdRight, fontWeight: 700 }}>{formatCurrency(totalCalc)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ ...tdRight, color: "#666" }}>
                  Total 
                </td>
                <td style={{ ...tdRight, color: "#666" }}>{pedido.total != null ? formatCurrency(pedido.total) : "—"}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
