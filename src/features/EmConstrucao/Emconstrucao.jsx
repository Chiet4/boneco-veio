import { Link } from "react-router-dom";
import styles from "./Emconstrucao.module.css";

export default function EmConstrucao() {
  return (
    <div className={styles.emconstrucao}>
      <h1>🚧 Página em Construção 🚧</h1>
      <p>Estamos trabalhando para trazer esta funcionalidade em breve.</p>
      <Link to="/" className={styles.btnvoltar}>Voltar para Home</Link>
    </div>
  );
}
