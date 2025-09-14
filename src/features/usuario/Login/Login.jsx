import "./Login.css";
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="bodyLogin">
      <div className="Login">
        <div className="login-container">
          <form className="login-form">
            <h1>Login</h1>

            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Digite seu nome..."
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha..."
              required
            />

            <Link to="/login">
              <button type="button">Entrar no perfil</button>
            </Link>

            <Link to="/">
              <button className="botao-voltar" type="button">Voltar para Home</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
