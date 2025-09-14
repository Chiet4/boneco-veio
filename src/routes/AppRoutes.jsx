// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
// Pages (importações organizadas por feature)
import PerfilPage from '../features/usuario/pages/PerfilPage';
import Home from '../pages/Home';
import EditarProduto from '../features/produto/pages/EditarProduto';
import CadastrarProduto from '../features/produto/pages/CadastrarProduto';
import PrateleiraPage from '../pages/PrateleiraPage';
import CarrinhoPage from '../features/carrinho/pages/CarrinhoPage';
import NotFound from '../features/notfound/NotFoundComponent';
import Login from '../features/usuario/Login/Login';
import ProdutoDetalhePage from '../features/produto/pages/ProdutoDetalhePage';
import Emconstrucao from '../features/EmConstrucao/Emconstrucao';

function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<PrateleiraPage />} />
          <Route path="/produtos" element={<PrateleiraPage />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhePage />} />
          <Route path="/admin/produtos/editar/:id" element={<EditarProduto />} />
          <Route path="/admin/produtos/novo" element={<CadastrarProduto />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/pedidos" element={<Emconstrucao />} />
          <Route path="/rastreio" element={<Emconstrucao />} />
          <Route path="/contato" element={<Emconstrucao />} />
          <Route path="/endereco" element={<Emconstrucao />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
