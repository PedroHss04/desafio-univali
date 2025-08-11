import { useState, useEffect } from "react";

export function useFormularioItem({
  id,
  estaEditando,
  obterItem,
  adicionarItem,
  atualizarItem,
  navegar,
}) {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    unidadeMedida: "",
    quantidade: "",
    preco: "",
    perecivel: false,
    dataValidade: "",
    dataFabricacao: "",
  });

  const [precoRaw, setPrecoRaw] = useState("");
  const [erros, setErros] = useState({});
  const [tocado, setTocado] = useState({});

  useEffect(() => {
    if (estaEditando) {
      const item = obterItem(id);
      if (item) {
        setDadosFormulario({
          nome: item.nome || "",
          unidadeMedida: item.unidadeMedida || "",
          quantidade:
            item.quantidade !== undefined && item.quantidade !== null
              ? item.quantidade.toString()
              : "",
          preco:
            item.preco !== undefined && item.preco !== null
              ? item.preco.toFixed(2).replace(".", ",")
              : "",
          perecivel: item.perecivel || false,
          dataValidade: item.dataValidade || "",
          dataFabricacao: item.dataFabricacao || "",
        });

        if (item.preco) {
          setPrecoRaw(Math.round(parseFloat(item.preco) * 100).toString());
        }
      }
    }
  }, [id, estaEditando, obterItem]);

  const validarCampo = (nomeCampo, valor) => {
    const novosErros = { ...erros };

    switch (nomeCampo) {
      case "nome":
        if (!valor.trim()) {
          novosErros.nome = "Nome do item é obrigatório";
        } else if (valor.length > 50) {
          novosErros.nome = "Nome deve ter no máximo 50 caracteres";
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) {
          novosErros.nome = "Nome deve conter apenas letras";
        } else {
          delete novosErros.nome;
        }
        break;

      case "unidadeMedida":
        if (!valor) {
          novosErros.unidadeMedida = "Unidade de medida é obrigatória";
        } else {
          delete novosErros.unidadeMedida;
        }
        break;

      case "quantidade":
        if (!valor) {
          novosErros.quantidade = "Quantidade é obrigatória";
        } else if (dadosFormulario.unidadeMedida === "Unidade") {
          if (!/^\d+$/.test(valor)) {
            novosErros.quantidade =
              "A quantidade só pode ser um número inteiro";
          } else {
            delete novosErros.quantidade;
          }
        } else {
          if (!/^\d+([.,]\d{1,3})?$/.test(valor)) {
            novosErros.quantidade =
              "Quantidade deve ter no máximo 3 casas decimais";
          } else {
            delete novosErros.quantidade;
          }
        }
        break;

      case "preco":
        if (!valor) {
          novosErros.preco = "Preço é obrigatório";
        } else {
          const precoLimpo = valor.replace(/\s/g, "").trim();
          const regexPreco = /^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/;

          if (!regexPreco.test(precoLimpo)) {
            novosErros.preco =
              "Preço deve estar no formato correto, ex: 1.234,56";
          } else {
            delete novosErros.preco;
          }
        }
        break;

      case "dataValidade":
        if (dadosFormulario.perecivel) {
          if (!valor) {
            novosErros.dataValidade =
              "Data de validade é obrigatória para produtos perecíveis";
          } else {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const dataValidade = new Date(valor);
            if (dataValidade < hoje) {
              novosErros.dataValidade =
                "Produto vencido - data de validade inferior à data atual";
            } else {
              delete novosErros.dataValidade;
            }
          }
        } else {
          delete novosErros.dataValidade;
        }
        break;

      case "dataFabricacao":
        if (!valor) {
          novosErros.dataFabricacao = "Data de fabricação é obrigatória";
        } else {
          const dataFabricacao = new Date(valor);
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          if (dataFabricacao > hoje) {
            novosErros.dataFabricacao =
              "Data de fabricação não pode ser maior que a data atual";
          } else if (
            dadosFormulario.perecivel &&
            dadosFormulario.dataValidade
          ) {
            const dataValidade = new Date(dadosFormulario.dataValidade);
            if (dataFabricacao > dataValidade) {
              novosErros.dataFabricacao =
                "Data de fabricação não pode ser superior à data de validade";
            } else {
              delete novosErros.dataFabricacao;
            }
          } else {
            delete novosErros.dataFabricacao;
          }
        }
        break;

      default:
        break;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const lidarComMudanca = (evento) => {
    const {
      name: nomeCampo,
      value: valorCampo,
      type: tipoCampo,
      checked: marcado,
    } = evento.target;
    const novoValor = tipoCampo === "checkbox" ? marcado : valorCampo;

    setDadosFormulario((prev) => ({
      ...prev,
      [nomeCampo]: novoValor,
    }));

    if (tocado[nomeCampo]) {
      validarCampo(nomeCampo, novoValor);
    }

    if (nomeCampo === "perecivel" && !novoValor) {
      setDadosFormulario((prev) => ({ ...prev, dataValidade: "" }));
      setErros((prev) => {
        const novoErro = { ...prev };
        delete novoErro.dataValidade;
        return novoErro;
      });
    }

    if (nomeCampo === "unidadeMedida") {
      setDadosFormulario((prev) => ({ ...prev, quantidade: "" }));
      setErros((prev) => ({ ...prev, quantidade: undefined }));
    }
  };

  const lidarComBlur = (evento) => {
    const { name: nomeCampo, value: valorCampo } = evento.target;
    setTocado((prev) => ({ ...prev, [nomeCampo]: true }));
    validarCampo(nomeCampo, valorCampo);
  };

  const validarFormulario = () => {
    const campos = [
      "nome",
      "unidadeMedida",
      "quantidade",
      "preco",
      "dataFabricacao",
    ];
    if (dadosFormulario.perecivel) {
      campos.push("dataValidade");
    }

    let estaValido = true;
    campos.forEach((campo) => {
      if (!validarCampo(campo, dadosFormulario[campo])) {
        estaValido = false;
      }
    });

    setTocado(campos.reduce((acc, campo) => ({ ...acc, [campo]: true }), {}));
    return estaValido;
  };

  const lidarComEnvio = (evento) => {
    evento.preventDefault();
    if (!validarFormulario()) return;

    let quantidadeFormatada = null;
    if (dadosFormulario.quantidade) {
      quantidadeFormatada = parseFloat(
        dadosFormulario.quantidade.replace(",", ".")
      );
    }

    const precoNumerico = precoRaw ? Number(precoRaw) / 100 : 0;

    const dadosItem = {
      ...dadosFormulario,
      preco: precoNumerico,
      quantidade: quantidadeFormatada,
    };

    if (estaEditando) {
      atualizarItem(id, dadosItem);
    } else {
      adicionarItem(dadosItem);
    }
    navegar("/itens");
  };

  const obterSufixoUnidade = () => {
    switch (dadosFormulario.unidadeMedida) {
      case "Litro":
        return "lt";
      case "Quilograma":
        return "kg";
      case "Unidade":
        return "un";
      default:
        return "";
    }
  };

  const lidarComMudancaPreco = (evento) => {
    const numeros = evento.target.value.replace(/\D/g, "");
    setPrecoRaw(numeros);

    const valorNumerico = numeros ? (Number(numeros) / 100).toFixed(2) : "";
    const valorFormatado = valorNumerico.replace(".", ",");

    setDadosFormulario((prev) => ({
      ...prev,
      preco: valorFormatado,
    }));

    if (tocado.preco) {
      validarCampo("preco", valorFormatado);
    }
  };

  const precoFormatado = precoRaw
    ? (Number(precoRaw) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";

  return {
    dadosFormulario,
    erros,
    precoFormatado,
    lidarComMudanca,
    lidarComBlur,
    lidarComEnvio,
    obterSufixoUnidade,
    lidarComMudancaPreco,
  };
}


