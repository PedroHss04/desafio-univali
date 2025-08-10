import React from 'react';
import { BrowserRouter as Roteador, Routes, Route } from 'react-router-dom';
import Layout from './componentes/Layout';
import FormularioItem from './paginas/FormularioItem';
import ListaItens from './paginas/ListaItens';
import { ProvedorItens } from './contexto/ContextoItem';

function App() {
  return (
    <ProvedorItens>
      <Roteador>
        <Layout>
          <Routes>
            <Route path="/" element={<ListaItens />} />
            <Route path="/itens" element={<ListaItens />} />
            <Route path="/formulario" element={<FormularioItem />} />
            <Route path="/formulario/:id" element={<FormularioItem />} />
          </Routes>
        </Layout>
      </Roteador>
    </ProvedorItens>
  );
}

export default App;
