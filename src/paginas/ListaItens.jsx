import React, { useState } from "react";
import { useItens } from "../contexto/ContextoItem";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const ListaItens = () => {
  const {
    itens,
    excluirItem,
    mostrarNotificacao,
    gerarItensAleatorios,
    apagarTodosItens,
  } = useItens();

  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const [confirmarApagarTodos, setConfirmarApagarTodos] = useState(false);
  const navegar = useNavigate();

  // Agora guarda o item completo para mostrar o nome no modal
  const lidarComExclusao = (item) => {
    setItemParaExcluir(item);
  };

  const confirmarExclusao = async () => {
    if (itemParaExcluir) {
      await excluirItem(itemParaExcluir.id);
      mostrarNotificacao("Item excluído com sucesso!", "sucesso");
      setItemParaExcluir(null);
      navegar("/itens");
    }
  };

  const cancelarExclusao = () => {
    setItemParaExcluir(null);
  };

  const confirmarApagarTudo = () => {
    apagarTodosItens();
    setConfirmarApagarTodos(false);
    navegar("/itens");
  };

  const formatarPreco = (preco) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);

  const formatarData = (dataString) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const obterSufixoUnidade = (unidadeMedida, quantidade) => {
    if (!quantidade) return "";
    switch (unidadeMedida) {
      case "Litro":
        return `${quantidade} lt`;
      case "Quilograma":
        return `${quantidade} kg`;
      case "Unidade":
        return `${quantidade} un`;
      default:
        return quantidade;
    }
  };

  const estaVencido = (dataValidade) => {
    if (!dataValidade) return false;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    return validade < hoje;
  };

  return (
    <div className="px-6 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">
          Seus Itens Cadastrados
        </h1>
        <div className="flex gap-2">
          <Link
            to="/formulario"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-700 transition"
          >
            + Adicionar Item
          </Link>
          <button
            onClick={gerarItensAleatorios}
            className="inline-block rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-green-700 transition"
            type="button"
          >
            Gerar Itens Aleatórios
          </button>
          <button
            onClick={() => setConfirmarApagarTodos(true)}
            className="inline-block rounded-md bg-red-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-red-700 transition"
            type="button"
            disabled={itens.length === 0}
            title={
              itens.length === 0
                ? "Nenhum item para apagar"
                : "Apagar todos os itens"
            }
          >
            Apagar Todos
          </button>
        </div>
      </div>

      {itens.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-12">
          Nenhum item cadastrado ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                {[
                  "Nome",
                  "Unidade",
                  "Quantidade",
                  "Preço",
                  "Perecível",
                  "Validade",
                  "Fabricação",
                  "Ações",
                ].map((titulo, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-6 py-4 text-left text-sm font-semibold tracking-wide ${
                      i === 7 ? "text-center" : ""
                    }`}
                  >
                    {titulo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itens.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-blue-50 ${
                    estaVencido(item.dataValidade) ? "bg-red-50" : ""
                  } transition-colors duration-200`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {item.unidadeMedida}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {obterSufixoUnidade(item.unidadeMedida, item.quantidade)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {formatarPreco(item.preco)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {item.perecivel ? "Sim" : "Não"}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm whitespace-nowrap ${
                      estaVencido(item.dataValidade)
                        ? "text-red-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {formatarData(item.dataValidade)}
                    {estaVencido(item.dataValidade) && (
                      <span className="ml-2 text-xs font-semibold text-red-600">
                        (Vencido)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {formatarData(item.dataFabricacao)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap space-x-5 flex justify-center">
                    <Link
                      to={`/formulario/${item.id}`}
                      className="text-blue-600 hover:text-blue-800 transition p-2 rounded-md bg-blue-100 hover:bg-blue-200"
                      title={`Editar ${item.nome}`}
                      aria-label={`Editar ${item.nome}`}
                    >
                      <FiEdit2 size={20} />
                    </Link>
                    <button
                      onClick={() => lidarComExclusao(item)} // Passa o item inteiro aqui
                      className="text-red-600 hover:text-red-800 transition p-2 rounded-md bg-red-100 hover:bg-red-200"
                      title={`Excluir ${item.nome}`}
                      aria-label={`Excluir ${item.nome}`}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão Individual */}
      {itemParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Confirmar Exclusão
            </h2>
            <p className="text-gray-700 mb-6">
              Tem certeza de que deseja excluir o item{" "}
              <strong>{itemParaExcluir.nome}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelarExclusao}
                className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação Apagar Todos */}
      {confirmarApagarTodos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Confirmar Exclusão
            </h2>
            <p className="text-gray-700 mb-6">
              Tem certeza de que deseja apagar todos os itens? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmarApagarTodos(false)}
                className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarApagarTudo}
                className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
              >
                Apagar Todos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaItens;
