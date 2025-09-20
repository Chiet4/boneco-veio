import { useEffect, useMemo, useState, useCallback } from "react";
import { listarUsuarios } from "../../../features/produto/services/adminUsuariosService";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import UsuarioDetalhe from "../../usuario/listarUsuarios/UsuarioDetalhe";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // estado de seleção (mestre-detalhe)
  const [selecionadoId, setSelecionadoId] = useState(null);

  const totalPages = useMemo(() => {
    if (!perPage || !total) return 1;
    return Math.max(1, Math.ceil(total / perPage));
  }, [total, perPage]);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setErro("");
      // sem q (busca)
      const data = await listarUsuarios({ page, perPage });
      setUsuarios(data.items);
      setTotal(data.total);
      setPerPage(data.perPage);
    } catch (e) {
      setErro("Falha ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    if (selecionadoId) return; // se está no detalhe, não recarrega lista
    fetchUsuarios();
  }, [fetchUsuarios, selecionadoId]);

  function handleNext() { setPage((p) => Math.min(p + 1, totalPages)); }
  function handlePrev() { setPage((p) => Math.max(p - 1, 1)); }
  function handlePerPageChange(e) { setPage(1); setPerPage(Number(e.target.value) || 12); }

  // acessível: permite Enter/Espaço na linha
  function rowA11yHandlers(onClick) {
    return {
      role: "button",
      tabIndex: 0,
      onClick,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }
    };
  }

  return (
    <>
      <Header />

      <main className="container" style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          {/* Título fixo, sem "Detalhes do Usuário" */}
          <h1 style={{ margin: 0, fontSize: 24 }}>Lista de Usuários (Admin)</h1>
        </div>

        {!selecionadoId ? (
          <>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ fontSize: 14, color: "#555" }}>
                Itens por página:&nbsp;
                <select value={perPage} onChange={handlePerPageChange} style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd" }}>
                  <option value={5}>5</option>
                  <option value={12}>12</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <span style={{ fontSize: 14, color: "#555" }}>
                Página {page} de {totalPages} — Total: {total}
              </span>
            </div>

            <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
              {loading ? (
                <div style={{ padding: 24 }}>Carregando usuários…</div>
              ) : erro ? (
                <div style={{ padding: 24, color: "#b00020" }}>{erro}</div>
              ) : usuarios.length === 0 ? (
                <div style={{ padding: 24 }}>Nenhum usuário encontrado.</div>
              ) : (
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
                      <tr>
                        <th style={thStyle}>Nome</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Papel</th>
                        <th style={thStyle}>Criado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr
                          key={u.id}
                          style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                          {...rowA11yHandlers(() => setSelecionadoId(u.id))}
                          title="Ver detalhes"
                        >
                          <td style={tdStyle}>{u.name}</td>
                          <td style={tdStyle}>{u.email}</td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: 999,
                                fontSize: 12,
                                background: u.role === "ADMIN" ? "#e3f2fd" : "#f1f8e9",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleString("pt-BR") : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <button onClick={handlePrev} disabled={page <= 1} style={buttonNavStyle(page <= 1)}>← Anterior</button>
              <div style={{ fontSize: 14, color: "#555" }}>Página {page} / {totalPages}</div>
              <button onClick={handleNext} disabled={page >= totalPages} style={buttonNavStyle(page >= totalPages)}>Próxima →</button>
            </div>
          </>
        ) : (
          <UsuarioDetalhe
            userId={selecionadoId}
            onVoltar={() => setSelecionadoId(null)}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

const thStyle = { textAlign: "left", padding: "12px 16px", fontWeight: 600, fontSize: 13, color: "#444" };
const tdStyle = { padding: "12px 16px", fontSize: 14, color: "#333" };
const buttonNavStyle = (disabled) => ({
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: disabled ? "#f5f5f5" : "#fff",
  color: disabled ? "#aaa" : "#222",
  cursor: disabled ? "not-allowed" : "pointer",
});
