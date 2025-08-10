import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiClipboard, FiPlus, FiMenu } from "react-icons/fi";
import { useItens } from "../contexto/ContextoItem";
import Notificacao from "./Notificacao";

const Layout = ({ children }) => {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const localizacao = useLocation();
  const { notificacao } = useItens();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarAberta(false);
      }
    };

    window.addEventListener("resize", handleResize);

    if (window.innerWidth >= 1024) {
      setSidebarAberta(false);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navegacao = [
    {
      nome: "Listagem de Itens",
      href: "/itens",
      icone: <FiClipboard size={20} />,
    },
    {
      nome: "Cadastrar Item",
      href: "/formulario",
      icone: <FiPlus size={20} />,
    },
  ];

  const estaAtivo = (href) => {
    if (href === "/itens") {
      return localizacao.pathname === "/" || localizacao.pathname === "/itens";
    }
    return localizacao.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarAberta ? "block" : "hidden"
        } bg-white`}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center border-b border-gray-200">
            <button
              onClick={() => setSidebarAberta(false)}
              className="text-gray-700 hover:text-gray-900 ml-4"
              aria-label="Fechar menu"
            >
              <FiMenu
                className={`h-6 w-6`}
              />
            </button>

            <h1 className="ml-4 text-xl font-bold text-gray-900">Menu</h1>
          </div>
          <nav className="flex-1 overflow-auto px-2 py-4">
            {navegacao.map((item) => (
              <Link
                key={item.nome}
                to={item.href}
                onClick={() => setSidebarAberta(false)}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  estaAtivo(item.href)
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{item.icone}</span>
                {item.nome}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Menu</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navegacao.map((item) => (
              <Link
                key={item.nome}
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  estaAtivo(item.href)
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{item.icone}</span>
                {item.nome}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="lg:pl-64">
        {/* Header mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarAberta(!sidebarAberta)}
            className="text-gray-700 hover:text-gray-900"
            aria-label={sidebarAberta ? "Fechar menu" : "Abrir menu"}
          >
            <FiMenu
              className={`h-6 w-6`}
            />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Menu</h1>
        </div>

        {/* Conteúdo da página */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Notificações */}
      {notificacao && <Notificacao {...notificacao} />}
    </div>
  );
};

export default Layout;
