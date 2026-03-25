import { useEffect, useMemo, useState } from "react";
import ModalEntrega from "../components/modals/ModalEntrega";
import ModalPeriodoRelatorioEntregas from "../components/modals/ModalPeriodoRelatorioEntregas";
import { temPermissao } from "../utils/permissoes";
import { formatarDataBR } from "../utils/entregasFormatters";
import {
  filtrarEntregas,
  ordenarEntregasPorDataDesc,
  totalItensDaLista,
  totalTiposDaLista,
  paginarLista,
} from "../utils/entregasHelpers";
import {
  carregarDadosEntregas,
  obterDadosMockEntregas,
} from "../services/entregaService";
import { useEntregasRelatorio } from "../hooks/useEntregasRelatorio";

function Entregas({ usuarioLogado }) {
  const [entregas, setEntregas] = useState([]);
  const [itensEntregues, setItensEntregues] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [epis, setEpis] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erroTela, setErroTela] = useState("");

  const itensPorPagina = 5;

  const podeVisualizar = !usuarioLogado
    ? true
    : temPermissao(usuarioLogado, ["admin", "tecnico", "almoxarife", "colaborador"]);

  const carregarEntregas = async () => {
    setCarregando(true);
    setErroTela("");

    try {
      const dados = await carregarDadosEntregas();
      setFuncionarios(dados.funcionarios);
      setEpis(dados.epis);
      setTamanhos(dados.tamanhos);
      setEntregas(dados.entregas);
      setItensEntregues(dados.itensEntregues);
    } catch (erro) {
      console.error("Erro ao carregar entregas:", erro);
      setErroTela(
        erro?.message || "Não foi possível carregar os dados das entregas."
      );

      const dadosMock = obterDadosMockEntregas();
      setFuncionarios(dadosMock.funcionarios);
      setEpis(dadosMock.epis);
      setTamanhos(dadosMock.tamanhos);
      setEntregas(dadosMock.entregas);
      setItensEntregues(dadosMock.itensEntregues);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEntregas();
  }, []);

  const aoMudarFiltro = (setter, valor) => {
    setter(valor);
    setPaginaAtual(1);
  };

  const entregasResolvidas = useMemo(() => {
    return entregas.map((entrega) => {
      const funcionario = funcionarios.find(
        (f) => Number(f.id) === Number(entrega.idFuncionario)
      );

      const itensDaTabela = itensEntregues.filter(
        (item) => Number(item.idEntrega) === Number(entrega.id)
      );

      const itensResolvidos =
        itensDaTabela.length > 0
          ? itensDaTabela.map((item) => {
              const epi = epis.find((e) => Number(e.id) === Number(item.idEpi));
              const tamanho = tamanhos.find(
                (t) => Number(t.id) === Number(item.idTamanho)
              );

              return {
                id: item.id,
                epiNome: item.epiNome || epi?.nome || "EPI não identificado",
                tamanho: item.tamanhoTexto || tamanho?.tamanho || "-",
                quantidade: item.quantidade || 0,
              };
            })
          : (entrega.itens || []).map((item, index) => ({
              id: item.id ?? `${entrega.id}-${index}`,
              epiNome: item.epiNome || item.nome || "EPI não identificado",
              tamanho: item.tamanho || item.tamanhoNome || "-",
              quantidade: Number(item.quantidade ?? 0),
            }));

      return {
        id: entrega.id,
        idFuncionario: entrega.idFuncionario,
        dataEntrega: String(entrega.data_entrega || "").substring(0, 10),
        assinatura: entrega.assinatura,
        tokenValidacao: entrega.token_validacao,
        funcionario,
        itens: itensResolvidos,
      };
    });
  }, [entregas, itensEntregues, funcionarios, epis, tamanhos]);

  const {
    modalPeriodoAberto,
    tipoRelatorioModal,
    funcionarioSelecionado,
    periodoRelatorioInicio,
    periodoRelatorioFim,
    erroPeriodoModal,
    resumoModalPeriodo,
    setPeriodoRelatorioInicio,
    setPeriodoRelatorioFim,
    resetarModalPeriodo,
    abrirModalRelatorioGeral,
    abrirModalRelatorioFuncionario,
    confirmarGeracaoRelatorio,
    limparModalPeriodo,
    aplicarAtalhoPeriodo,
  } = useEntregasRelatorio(entregasResolvidas, dataInicio, dataFim);

  const entregasFiltradas = useMemo(() => {
    return filtrarEntregas(entregasResolvidas, busca, dataInicio, dataFim);
  }, [entregasResolvidas, busca, dataInicio, dataFim]);

  const entregasOrdenadas = useMemo(() => {
    return ordenarEntregasPorDataDesc(entregasFiltradas);
  }, [entregasFiltradas]);

  const paginacao = useMemo(() => {
    return paginarLista(entregasOrdenadas, paginaAtual, itensPorPagina);
  }, [entregasOrdenadas, paginaAtual]);

  const { totalPaginas, paginaSegura, itens: entregasVisiveis } = paginacao;

  useEffect(() => {
    if (paginaAtual !== paginaSegura) {
      setPaginaAtual(paginaSegura);
    }
  }, [paginaAtual, paginaSegura]);

  const estatisticasTela = useMemo(() => {
    return {
      totalEntregas: entregasOrdenadas.length,
      totalItens: totalItensDaLista(entregasOrdenadas),
      totalTipos: totalTiposDaLista(entregasOrdenadas),
    };
  }, [entregasOrdenadas]);

  const aoSalvarEntrega = async () => {
    setModalAberto(false);
    await carregarEntregas();
    setPaginaAtual(1);
  };

  if (!podeVisualizar) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-amber-700">
          Você não tem permissão para visualizar a tela de entregas.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            📋 Histórico de Entregas
          </h2>
          <p className="text-sm text-gray-500">
            Consulte, filtre e imprima relatórios de entrega de EPIs.
          </p>
        </div>

        <div className="flex w-full xl:w-auto gap-2 flex-col sm:flex-row">
          <button
            onClick={abrirModalRelatorioGeral}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-sm flex items-center gap-2 justify-center w-full xl:w-auto"
          >
            <span>🖨️</span> Relatório Geral
          </button>

          <button
            onClick={() => setModalAberto(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-sm flex items-center gap-2 justify-center w-full xl:w-auto"
          >
            <span>➕</span> Nova Entrega
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <span className="text-[11px] text-blue-700 uppercase font-bold tracking-wide block mb-1">
            Entregas visíveis
          </span>
          <strong className="text-2xl text-blue-900">
            {carregando ? "--" : estatisticasTela.totalEntregas}
          </strong>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <span className="text-[11px] text-indigo-700 uppercase font-bold tracking-wide block mb-1">
            Itens distribuídos
          </span>
          <strong className="text-2xl text-indigo-900">
            {carregando ? "--" : estatisticasTela.totalItens}
          </strong>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <span className="text-[11px] text-gray-600 uppercase font-bold tracking-wide block mb-1">
            Tipos de item
          </span>
          <strong className="text-2xl text-gray-900">
            {carregando ? "--" : estatisticasTela.totalTipos}
          </strong>
        </div>
      </div>

      {erroTela && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {erroTela}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Nome, matrícula, EPI ou tamanho..."
              value={busca}
              onChange={(e) => aoMudarFiltro(setBusca, e.target.value)}
              className="w-full pl-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => aoMudarFiltro(setDataInicio, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => aoMudarFiltro(setDataFim, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
          Carregando entregas...
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Colaborador</th>
                  <th className="p-4 font-semibold">Itens Entregues</th>
                  <th className="p-4 font-semibold text-center">Assinatura</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {entregasVisiveis.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  entregasVisiveis.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-600 font-mono text-sm whitespace-nowrap">
                        {formatarDataBR(e.dataEntrega)}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => abrirModalRelatorioFuncionario(e.funcionario)}
                          className="text-left group"
                        >
                          <div className="font-bold text-blue-700 group-hover:text-blue-900 group-hover:underline transition">
                            {e.funcionario?.nome || "Desconhecido"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Mat: {e.funcionario?.matricula || "--"}
                          </div>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {e.itens.length > 0 ? (
                            e.itens.map((i) => (
                              <span
                                key={i.id}
                                className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded border border-blue-100"
                              >
                                {i.epiNome} ({i.tamanho}) <b>x{i.quantidade}</b>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              Sem itens vinculados
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        {e.assinatura || e.tokenValidacao ? (
                          <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
                            Digital ✍️
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            Manual 📄
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div className="flex justify-between items-center mt-6 px-1">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaSegura === 1}
                className="px-4 py-2 rounded text-sm font-bold border"
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
                className="px-4 py-2 rounded text-sm font-bold border"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      {modalAberto && (
        <ModalEntrega
          onClose={() => setModalAberto(false)}
          onSalvar={aoSalvarEntrega}
        />
      )}

      <ModalPeriodoRelatorioEntregas
        aberto={modalPeriodoAberto}
        tipo={tipoRelatorioModal}
        funcionario={funcionarioSelecionado}
        inicio={periodoRelatorioInicio}
        fim={periodoRelatorioFim}
        erro={erroPeriodoModal}
        resumo={resumoModalPeriodo}
        onClose={resetarModalPeriodo}
        onChangeInicio={(valor) => {
          setPeriodoRelatorioInicio(valor);
        }}
        onChangeFim={(valor) => {
          setPeriodoRelatorioFim(valor);
        }}
        onConfirmar={confirmarGeracaoRelatorio}
        onLimpar={limparModalPeriodo}
        onAplicarAtalho={aplicarAtalhoPeriodo}
      />
    </div>
  );
}

export default Entregas;