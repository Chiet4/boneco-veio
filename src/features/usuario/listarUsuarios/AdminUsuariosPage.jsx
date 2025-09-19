import { useEffect, useState } from "react";
import { listarUsuarios } from "../../../features/produto/services/adminUsuariosService";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        setLoading(true);
        setErro("");
        const data = await listarUsuarios();
        setUsuarios(data.items);
      } catch (e) {
        setErro("Falha ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  return (
    <>
      <Header />

      <main style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
        <h1>Usuários do Site</h1>

        {loading && <p>Carregando…</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        {!loading && !erro && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9f9f9" }}>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Papel</th>
                <th style={thStyle}>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.role}</td>
                  <td style={tdStyle}>
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      <Footer />
    </>
  );
}

const thStyle = { textAlign: "left", padding: "8px 12px", fontWeight: "bold" };
const tdStyle = { padding: "8px 12px" };
