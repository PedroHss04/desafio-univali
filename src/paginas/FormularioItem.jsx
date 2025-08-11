import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useItens } from "../contexto/ContextoItem";
import { useFormularioItem } from "../contexto/formularioFuncoes"; // As funções dessa página vem todas desse arquivo

const FormularioItem = () => {
  const navegar = useNavigate();
  const { id } = useParams();
  const { adicionarItem, atualizarItem, obterItem } = useItens();
  const estaEditando = Boolean(id);

  const {
    dadosFormulario,
    erros,
    precoFormatado,
    lidarComMudanca,
    lidarComBlur,
    lidarComEnvio,
    obterSufixoUnidade,
    lidarComMudancaPreco,
  } = useFormularioItem({
    id,
    estaEditando,
    obterItem,
    adicionarItem,
    atualizarItem,
    navegar,
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {estaEditando ? "Editar Item" : "Cadastrar Novo Item"}
      </h1>

      <form onSubmit={lidarComEnvio} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
          {/* Nome */}
          <div className="sm:col-span-6">
            <label
              htmlFor="nome"
              className="block mb-2 text-sm font-semibold text-gray-900"
            >
              Nome do Item <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={dadosFormulario.nome}
              onChange={lidarComMudanca}
              onBlur={lidarComBlur}
              maxLength={50}
              placeholder="Digite o nome do item"
              className={`block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 sm:text-sm transition ${
                erros.nome
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300 ring-transparent"
              }`}
            />
            {erros.nome && (
              <p className="mt-1 text-sm text-red-600 font-medium">{erros.nome}</p>
            )}
          </div>

          {/* Unidade de Medida */}
          <div className="sm:col-span-3">
            <label
              htmlFor="unidadeMedida"
              className="block mb-2 text-sm font-semibold text-gray-900"
            >
              Unidade de Medida <span className="text-red-600">*</span>
            </label>
            <select
              id="unidadeMedida"
              name="unidadeMedida"
              value={dadosFormulario.unidadeMedida}
              onChange={lidarComMudanca}
              onBlur={lidarComBlur}
              className={`block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-600 sm:text-sm transition ${
                erros.unidadeMedida
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300 ring-transparent"
              }`}
            >
              <option value="">Selecione</option>
              <option value="Litro">Litro</option>
              <option value="Quilograma">Quilograma</option>
              <option value="Unidade">Unidade</option>
            </select>
            {erros.unidadeMedida && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {erros.unidadeMedida}
              </p>
            )}
          </div>

          {/* Quantidade */}
          <div className="sm:col-span-3">
            <label
              htmlFor="quantidade"
              className="block mb-2 text-sm font-semibold text-gray-900"
            >
              Quantidade <span className="text-red-600">*</span>
            </label>
            <div
              className={`flex rounded-lg border ${
                erros.quantidade
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300"
              } focus-within:ring-2 focus-within:ring-blue-600 shadow-sm transition`}
            >
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={dadosFormulario.quantidade}
                onChange={lidarComMudanca}
                onBlur={lidarComBlur}
                disabled={!dadosFormulario.unidadeMedida}
                placeholder={
                  dadosFormulario.unidadeMedida === "Unidade"
                    ? "Ex: 10"
                    : "Ex: 1,500"
                }
                className="flex-grow rounded-l-lg border-0 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
              />
              {dadosFormulario.unidadeMedida && (
                <span className="flex items-center pr-4 text-gray-600 sm:text-sm select-none">
                  {obterSufixoUnidade()}
                </span>
              )}
            </div>
            {erros.quantidade && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {erros.quantidade}
              </p>
            )}
          </div>

          {/* Preço */}
          <div className="sm:col-span-3">
            <label
              htmlFor="preco"
              className="block mb-2 text-sm font-semibold text-gray-900"
            >
              Preço <span className="text-red-600">*</span>
            </label>
            <div
              className={`flex rounded-lg border ${
                erros.preco ? "border-red-500 ring-red-500" : "border-gray-300"
              } focus-within:ring-2 focus-within:ring-blue-600 shadow-sm transition`}
            >
              <span className="flex items-center pl-4 pr-2 text-gray-600 sm:text-sm select-none">
                R$
              </span>
              <input
                type="text"
                id="preco"
                name="preco"
                value={precoFormatado}
                onChange={lidarComMudancaPreco}
                onBlur={lidarComBlur}
                placeholder="0,00"
                className="flex-grow rounded-r-lg border-0 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
              />
            </div>
            {erros.preco && (
              <p className="mt-1 text-sm text-red-600 font-medium">{erros.preco}</p>
            )}
          </div>

          {/* Produto Perecível */}
          <div className="sm:col-span-6">
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                id="perecivel"
                name="perecivel"
                type="checkbox"
                checked={dadosFormulario.perecivel}
                onChange={lidarComMudanca}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-3 text-gray-900 font-semibold">
                Produto Perecível
              </span>
            </label>
            <p className="ml-8 mt-1 text-gray-500 text-sm">
              Marque se o produto possui data de validade
            </p>
          </div>

          {/* Data de Fabricação */}
          <div className="sm:col-span-3">
            <label
              htmlFor="dataFabricacao"
              className="block mb-2 text-sm font-semibold text-gray-900"
            >
              Data de Fabricação <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="dataFabricacao"
              name="dataFabricacao"
              value={dadosFormulario.dataFabricacao}
              onChange={lidarComMudanca}
              onBlur={lidarComBlur}
              className={`block w-full rounded-lg border px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-600 sm:text-sm transition ${
                erros.dataFabricacao
                  ? "border-red-500 ring-red-500"
                  : "border-gray-300 ring-transparent"
              }`}
            />
            {erros.dataFabricacao && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {erros.dataFabricacao}
              </p>
            )}
          </div>

          {/* Data de Validade */}
          {dadosFormulario.perecivel && (
            <div className="sm:col-span-3">
              <label
                htmlFor="dataValidade"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                Data de Validade <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="dataValidade"
                name="dataValidade"
                value={dadosFormulario.dataValidade}
                onChange={lidarComMudanca}
                onBlur={lidarComBlur}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-600 sm:text-sm transition ${
                  erros.dataValidade
                    ? "border-red-500 ring-red-500"
                    : "border-gray-300 ring-transparent"
                }`}
              />
              {erros.dataValidade && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {erros.dataValidade}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          {estaEditando ? "Salvar Alterações" : "Cadastrar Item"}
        </button>
      </form>
    </div>
  );
};

export default FormularioItem;

