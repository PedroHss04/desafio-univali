/**
 * Esse arquivo é chamado pelo FormularioItem e pelo ListaItens
 */

import React, { createContext, useContext, useState, useEffect } from "react";

const ContextoItem = createContext();

export const useItens = () => {
  const contexto = useContext(ContextoItem);
  if (!contexto) {
    throw new Error("useItens deve ser usado dentro de um ProvedorItens");
  }
  return contexto;
};

export const ProvedorItens = ({ children }) => {
  /**
   * Puxa itens do localStoratge
   */
  const [itens, setItens] = useState(() => {
    try {
      const itensSalvos = localStorage.getItem("itens");
      return itensSalvos ? JSON.parse(itensSalvos) : [];
    } catch (error) {
      console.error("Erro ao ler itens do localStorage:", error);
      return [];
    }
  });

  const [notificacao, setNotificacao] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("itens", JSON.stringify(itens));
    } catch (error) {
      console.error("Erro ao salvar itens no localStorage:", error);
    }
  }, [itens]);

  /**
   * Funções de Manipulação do Item
   */
  const adicionarItem = (item) => {
    const novoItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      dataCriacao: new Date().toISOString(),
    };
    setItens((prev) => [...prev, novoItem]);
    mostrarNotificacao("Item adicionado com sucesso!", "sucesso");
  };

  const atualizarItem = (id, itemAtualizado) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...itemAtualizado, id, dataAtualizacao: new Date().toISOString() }
          : item
      )
    );
    mostrarNotificacao("Item atualizado com sucesso!", "sucesso");
  };

  const excluirItem = (id) => {
    setItens((prev) => prev.filter((item) => item.id !== id));
    mostrarNotificacao("Item excluído com sucesso!", "sucesso");
  };

  const apagarTodosItens = () => {
    setItens([]);
    mostrarNotificacao("Todos os itens foram apagados!", "sucesso");
  };

  const obterItem = (id) => {
    return itens.find((item) => item.id === id);
  };

  const mostrarNotificacao = (mensagem, tipo = "info") => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  /**
   * Função para gerar 10 itens aleatórios para teste
   */
  const gerarItensAleatorios = () => {
    const nomes = [
      "Maçã",
      "Banana",
      "Laranja",
      "Leite",
      "Pão",
      "Queijo",
      "Arroz",
      "Feijão",
      "Carne",
      "Café",
    ];

    const unidades = ["Litro", "Quilograma", "Unidade"];

    const novosItens = Array.from({ length: 10 }, (_, i) => {
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const unidadeMedida =
        unidades[Math.floor(Math.random() * unidades.length)];
      const quantidade =
        unidadeMedida === "Unidade"
          ? Math.floor(Math.random() * 10) + 1 // Se for unidade tem que ser numero inteiro
          : +(Math.random() * 10 + 0.1).toFixed(3); // Senão, numeros com 3 casas decimais
      const preco = +(Math.random() * 100).toFixed(2);
      const perecivel = Math.random() > 0.5;
      const hoje = new Date();
      const dataFabricacao = new Date(
        hoje.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30
      ).toISOString(); // até 30 dias atrás
      const dataValidade = perecivel
        ? new Date(
            hoje.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 30
          ).toISOString()
        : null;

      return {
        id:
          Date.now().toString() +
          i +
          Math.random().toString(36).substring(2, 5),
        nome,
        unidadeMedida,
        quantidade,
        preco,
        perecivel,
        dataFabricacao,
        dataValidade,
        dataCriacao: new Date().toISOString(),
      };
    });

    setItens((prev) => [...prev, ...novosItens]);
    mostrarNotificacao("Itens aleatórios adicionados com sucesso!", "sucesso");
  };

  return (
    <ContextoItem.Provider
      value={{
        itens,
        adicionarItem,
        atualizarItem,
        excluirItem,
        apagarTodosItens,
        obterItem,
        notificacao,
        mostrarNotificacao,
        gerarItensAleatorios,
      }}
    >
      {children}
    </ContextoItem.Provider>
  );
};
