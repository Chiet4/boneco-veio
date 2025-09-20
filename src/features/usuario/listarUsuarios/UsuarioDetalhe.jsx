import { useEffect, useState } from "react";
import { getUsuarioPorId } from "../../produto/services/adminUsuariosService";

export default function UsuarioDetalhe({ userId, onVoltar }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let alive = true;
    async function fetchOne() {
      try {
        setLoading(true);
        setErro("");
        const data = await getUsuarioPorId(userId);
        if (alive) setUsuario(data);
      } catch (e) {
        if (alive) setErro("Falha ao carregar detalhes do usuário.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    fetchOne();
    return () => { alive = false; };
  }, [userId]);

  return (
    <section style={{ marginTop: 16 }}>
      <button
        onClick={onVoltar}
        style={{
          padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd",
          background: "#fff", cursor: "pointer", marginBottom: 16
        }}
      >
        ← Voltar para a lista
      </button>

      {loading && <div>Carregando detalhes…</div>}
      {erro && <div style={{ color: "#b00020" }}>{erro}</div>}

      {usuario && !loading && !erro && (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>{usuario.name}</h2>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p>
            <strong>Papel:</strong>{" "}
            <span
              style={{
                display: "inline-block", padding: "2px 8px", borderRadius: 999,
                fontSize: 12, background: usuario.role === "ADMIN" ? "#e3f2fd" : "#f1f8e9",
                border: "1px solid #e0e0e0"
              }}
            >
              {usuario.role}
            </span>
          </p>
          <p><strong>Criado em:</strong> {usuario.createdAt ? new Date(usuario.createdAt).toLocaleString("pt-BR") : "—"}</p>

          {/* Espaço para ações futuras (alterar role / remover) */}
        </div>
      )}
    </section>
  );
}
