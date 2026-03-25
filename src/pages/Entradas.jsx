import { useEffect, useMemo, useState } from "react";
import { temPermissao } from "../utils/permissoes";
import { formatarData, formatarMoeda } from "../utils/entradasFormatters";
import { normalizarEntrada } from "../utils/entradasNormalizers";
import {
  filtrarEntradas,
  ordenarEntradasPorDataDesc,
  resumirEntradas,
  paginarLista,
} from "../utils/entradasHelpers";
import {
  carregarDadosEntradas,
  obterDadosMockEntradas,
  salvarEntradaNoServidor,
} from "../services/entradaService";
import { useEntradasForm } from "../hooks/useEntradasForm";
import ModalEntrada from "../components/modals/ModalDEntrada";

function Entradas({ usuarioLogado }) {
  const [entradas, setEntradas] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [epis, setEpis] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);

  const [carregandoTela, setCarregandoTela] = useState(true);
  const [erroTela, setErroTela] = useState("");
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 5;

  const {
    modalAberto,
    idFornecedor,
    setIdFornecedor,
    idEpi,
    setIdEpi,
    idTamanho,
    setIdTamanho,
    quantidade,
    setQuantidade,
    dataEntrada,
    setDataEntrada,
    dataFabricacao,
    setDataFabricacao,
    dataValidade,
    setDataValidade,
    lote,
    setLote,
    valorUnitario,
    setValorUnitario,
    notaFiscalNumero,
    setNotaFiscalNumero,
    notaFiscalSerie,
    setNotaFiscalSerie,
    carregando,
    setCarregando,
    abrirModal,
    fecharModal,
    setModalAberto,
  } = useEntradasForm();

  const podeVisualizar = !usuarioLogado
    ? true
    : temPermissao(usuarioLogado, ["admin", "tecnico", "almoxarife", "colaborador"]);

  const podeCadastrar = !usuarioLogado
    ? true
    : temPermissao(usuarioLogado, ["admin", "gerente", "almoxarife", "tecnico"]);

  const carregarEntradas = async () => {
    setCarregandoTela(true);
    setErroTela("");

    try {
      const dados = await carregarDadosEntradas();
      setFornecedores(dados.fornecedores);
      setEpis(dados.epis);
      setTamanhos(dados.tamanhos);
      setEntradas(dados.entradas);
    } catch (erro) {
      console.error("Erro ao carregar entradas:", erro);
      setErroTela(
        erro?.message || "Não foi possível carregar os registros de entrada."
      );

      const dadosMock = obterDadosMockEntradas();
      setFornecedores(dadosMock.fornecedores);
      setEpis(dadosMock.epis);
      setTamanhos(dadosMock.tamanhos);
      setEntradas(dadosMock.entradas);
    } finally {
      setCarregandoTela(false);
    }
  };

  useEffect(() => {
    carregarEntradas();
  }, []);

  const entradasResolvidas = useMemo(() => {
    return entradas.map((entrada) => {
      const epi = epis.find((item) => Number(item.id) === Number(entrada.idEpi));
      const tamanho = tamanhos.find(
        (item) => Number(item.id) === Number(entrada.idTamanho)
      );
      const fornecedor = fornecedores.find(
        (item) => Number(item.id) === Number(entrada.idFornecedor)
      );

      return {
        ...entrada,
        epiNome: epi?.nome || "Desconhecido",
        epiFabricante: epi?.fabricante || "-",
        epiCA: epi?.CA || "-",
        tamanhoNome: tamanho?.tamanho || "-",
        fornecedorNome:
          fornecedor?.nome_fantasia ||
          fornecedor?.razao_social ||
          "Fornecedor não identificado",
      };
    });
  }, [entradas, epis, tamanhos, fornecedores]);

  const entradasFiltradas = useMemo(() => {
    return filtrarEntradas(entradasResolvidas, busca);
  }, [entradasResolvidas, busca]);

  const entradasOrdenadas = useMemo(() => {
    return ordenarEntradasPorDataDesc(entradasFiltradas);
  }, [entradasFiltradas]);

  const resumoTela = useMemo(() => {
    return resumirEntradas(entradasOrdenadas);
  }, [entradasOrdenadas]);

  const paginacao = useMemo(() => {
    return paginarLista(entradasOrdenadas, paginaAtual, itensPorPagina);
  }, [entradasOrdenadas, paginaAtual]);

  const { totalPaginas, paginaSegura, itens: entradasVisiveis } = paginacao;

  useEffect(() => {
    if (paginaAtual !== paginaSegura) {
      setPaginaAtual(paginaSegura);
    }
  }, [paginaAtual, paginaSegura]);

  const salvarEntrada = async () => {
    if (!idFornecedor || !idEpi || !idTamanho || !quantidade || !dataEntrada) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const qtd = Number(quantidade);
    const valor = Number(valorUnitario || 0);

    if (Number.isNaN(qtd) || qtd <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    if (Number.isNaN(valor) || valor < 0) {
      alert("Informe um valor unitário válido.");
      return;
    }

    setCarregando(true);

    const pacoteDados = {
      idFornecedor: Number(idFornecedor),
      idEpi: Number(idEpi),
      idTamanho: Number(idTamanho),
      quantidade: qtd,
      quantidadeAtual: qtd,
      data_entrada: dataEntrada,
      data_fabricacao: dataFabricacao || null,
      data_validade: dataValidade || null,
      lote: lote.trim(),
      valor_unitario: valor,
      nota_fiscal_numero: notaFiscalNumero.trim(),
      nota_fiscal_serie: notaFiscalSerie.trim(),
    };

    try {
      const salvouNoServidor = await salvarEntradaNoServidor(pacoteDados);

      if (salvouNoServidor) {
        await carregarEntradas();
      } else {
        const novaEntrada = normalizarEntrada({
          id: Date.now(),
          ...pacoteDados,
        });

        setEntradas((prev) => [novaEntrada, ...prev]);
      }

      setModalAberto(false);
      setPaginaAtual(1);
    } finally {
      setCarregando(false);
    }
  };

  if (!podeVisualizar) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-amber-700">
          Você não tem permissão para visualizar a tela de entradas.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            📥 Registro de Entradas
          </h2>
          <p className="text-sm text-gray-500">
            Histórico de entradas de estoque conforme a tabela entrada_epi.
          </p>
        </div>

        {podeCadastrar && (
          <button
            onClick={abrirModal}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm justify-center w-full lg:w-auto"
          >
            <span>➕</span> Nova Entrada
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <span className="text-[11px] text-emerald-700 uppercase font-bold tracking-wide block mb-1">
            Registros visíveis
          </span>
          <strong className="text-2xl text-emerald-900">
            {carregandoTela ? "--" : resumoTela.totalRegistros}
          </strong>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <span className="text-[11px] text-blue-700 uppercase font-bold tracking-wide block mb-1">
            Quantidade total
          </span>
          <strong className="text-2xl text-blue-900">
            {carregandoTela ? "--" : resumoTela.totalItens}
          </strong>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <span className="text-[11px] text-gray-600 uppercase font-bold tracking-wide block mb-1">
            Valor total
          </span>
          <strong className="text-2xl text-gray-900">
            {carregandoTela ? "--" : formatarMoeda(resumoTela.valorTotal)}
          </strong>
        </div>
      </div>

      {erroTela && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {erroTela}
        </div>
      )}

      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="Buscar por EPI, fabricante, fornecedor, lote, NF ou tamanho..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPaginaAtual(1);
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm lg:text-base"
        />
      </div>

      {carregandoTela ? (
        <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
          Carregando entradas...
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">EPI / Item</th>
                  <th className="p-4 font-semibold text-center">Tam.</th>
                  <th className="p-4 font-semibold text-center">Qtd.</th>
                  <th className="p-4 font-semibold">Fornecedor / Lote</th>
                  <th className="p-4 font-semibold">NF</th>
                  <th className="p-4 font-semibold text-right">Valor Un.</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {entradasVisiveis.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      Nenhuma entrada encontrada.
                    </td>
                  </tr>
                ) : (
                  entradasVisiveis.map((e) => {
                    const total =
                      Number(e.quantidade || 0) * Number(e.valor_unitario || 0);

                    return (
                      <tr key={e.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-gray-600 font-mono text-sm">
                          {formatarData(e.data_entrada)}
                        </td>

                        <td className="p-4">
                          <div className="font-medium text-gray-800">{e.epiNome}</div>
                          <div className="text-xs text-gray-400">
                            {e.epiFabricante || "-"} • CA: {e.epiCA || "-"}
                          </div>
                        </td>

                        <td className="p-4 text-center text-gray-600">
                          {e.tamanhoNome || "-"}
                        </td>

                        <td className="p-4 text-center">
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                            +{e.quantidade}
                          </span>
                        </td>

                        <td className="p-4 text-gray-600 text-sm">
                          <div className="font-bold">{e.fornecedorNome}</div>
                          <div className="text-xs text-gray-400">
                            Lote: {e.lote || "-"}
                          </div>
                        </td>

                        <td className="p-4 text-gray-600 text-sm">
                          Nº {e.nota_fiscal_numero || "-"} / Série{" "}
                          {e.nota_fiscal_serie || "-"}
                        </td>

                        <td className="p-4 text-right text-gray-600 font-mono text-sm">
                          {formatarMoeda(e.valor_unitario)}
                        </td>

                        <td className="p-4 text-right text-emerald-700 font-bold font-mono text-sm">
                          {formatarMoeda(total)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4">
            {entradasVisiveis.length > 0 ? (
              entradasVisiveis.map((e) => {
                const total =
                  Number(e.quantidade || 0) * Number(e.valor_unitario || 0);

                return (
                  <div
                    key={e.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        {formatarData(e.data_entrada)}
                      </span>

                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded border border-emerald-200">
                        +{e.quantidade} un
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {e.epiNome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Tamanho:{" "}
                      <strong className="text-gray-800">
                        {e.tamanhoNome || "Único"}
                      </strong>
                    </p>

                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">
                          Fornecedor
                        </span>
                        <span className="text-gray-700 font-medium truncate block">
                          {e.fornecedorNome}
                        </span>
                        <span className="text-xs text-gray-400">
                          Lote: {e.lote || "-"}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">
                          Total da NF
                        </span>
                        <span className="text-emerald-700 font-bold font-mono">
                          {formatarMoeda(total)}
                        </span>
                      </div>

                      <div className="col-span-2 pt-2 border-t border-gray-200">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">
                          Nota Fiscal
                        </span>
                        <span className="text-gray-700">
                          Nº {e.nota_fiscal_numero || "-"} / Série{" "}
                          {e.nota_fiscal_serie || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Nenhuma entrada encontrada.
              </div>
            )}
          </div>

          {totalPaginas > 1 && (
            <div className="flex justify-between items-center mt-6 px-1">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaSegura === 1}
                className={`px-4 py-2 rounded text-sm font-bold border ${
                  paginaSegura === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                }`}
              >
                ← Anterior
              </button>

              <span className="text-xs lg:text-sm text-gray-600">
                Pág. <b className="text-gray-900">{paginaSegura}</b> de <b>{totalPaginas}</b>
              </span>

              <button
                onClick={() =>
                  setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
                }
                disabled={paginaSegura === totalPaginas}
                className={`px-4 py-2 rounded text-sm font-bold border ${
                  paginaSegura === totalPaginas
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                }`}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      <ModalEntrada
        aberto={modalAberto}
        onClose={fecharModal}
        onSalvar={salvarEntrada}
        carregando={carregando}
        epis={epis}
        tamanhos={tamanhos}
        fornecedores={fornecedores}
        idEpi={idEpi}
        setIdEpi={setIdEpi}
        idTamanho={idTamanho}
        setIdTamanho={setIdTamanho}
        quantidade={quantidade}
        setQuantidade={setQuantidade}
        dataEntrada={dataEntrada}
        setDataEntrada={setDataEntrada}
        valorUnitario={valorUnitario}
        setValorUnitario={setValorUnitario}
        idFornecedor={idFornecedor}
        setIdFornecedor={setIdFornecedor}
        lote={lote}
        setLote={setLote}
        dataFabricacao={dataFabricacao}
        setDataFabricacao={setDataFabricacao}
        dataValidade={dataValidade}
        setDataValidade={setDataValidade}
        notaFiscalNumero={notaFiscalNumero}
        setNotaFiscalNumero={setNotaFiscalNumero}
        notaFiscalSerie={notaFiscalSerie}
        setNotaFiscalSerie={setNotaFiscalSerie}
      />
    </div>
  );
}

export default Entradas;