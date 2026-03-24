// src/pages/Devolucoes.jsx

import { useEffect, useMemo, useState } from "react";
import ModalBaixa from "../components/modals/ModalBaixa";
import ModalPeriodoRelatorio from "../components/modals/ModalPeriodoRelatorio";

import { temPermissao } from "../utils/permissoes";
import { formatarData } from "../utils/devolucoesFormatters";
import { normalizarDevolucao } from "../utils/devolucoesNormalizers";
import {
  filtrarDevolucoes,
  ordenarDevolucoesPorDataDesc,
  resumirDevolucoes,
  paginarLista,
} from "../utils/devolucoesHelpers";

import {
  carregarDadosDevolucoes,
  obterDadosMockDevolucoes,
} from "../services/devolucaoService";

import { useDevolucoesRelatorio } from "../hooks/useDevolucoesRelatorio";

export default function Devolucoes() {
  const [devolucoes, setDevolucoes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [epis, setEpis] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);
  const [motivos, setMotivos] = useState([]);

  const [busca, setBusca] = useState("");
  const [filtroMotivo, setFiltroMotivo] = useState("");
  const [filtroTroca, setFiltroTroca] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  const [modalAberto, setModalAberto] = useState(false);
  const [carregandoTela, setCarregandoTela] = useState(true);
  const [erroTela, setErroTela] = useState("");

  const {
    modalPeriodoAberto,
    tipoRelatorioModal,
    periodoRelatorioInicio,
    periodoRelatorioFim,
    erroPeriodoModal,
    resumoModal,
    setPeriodoRelatorioInicio,
    setPeriodoRelatorioFim,
    resetarModalPeriodo,
    abrirModalRelatorioGeral,
    abrirModalRelatorioFuncionario,
    limparDatasModal,
    confirmarGeracaoRelatorio,
  } = useDevolucoesRelatorio();

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
    } catch {
      return {};
    }
  })();

  const podeVisualizar = temPermissao(usuario, [
    "admin",
    "tecnico",
    "almoxarife",
    "colaborador",
  ]);

  const podeCadastrar = temPermissao(usuario, [
    "admin",
    "tecnico",
    "almoxarife",
  ]);

  const carregarDevolucoes = async () => {
    setCarregandoTela(true);
    setErroTela("");

    try {
      const dados = await carregarDadosDevolucoes();

      setFuncionarios(dados.funcionarios);
      setEpis(dados.epis);
      setTamanhos(dados.tamanhos);
      setMotivos(dados.motivos);
      setDevolucoes(dados.devolucoes);
    } catch (erro) {
      console.error("Erro ao carregar devoluções:", erro);

      setErroTela(
        erro?.message || "Não foi possível carregar os registros de devolução."
      );

      const dadosMock = obterDadosMockDevolucoes();

      setFuncionarios(dadosMock.funcionarios);
      setEpis(dadosMock.epis);
      setTamanhos(dadosMock.tamanhos);
      setMotivos(dadosMock.motivos);
      setDevolucoes(dadosMock.devolucoes);
    } finally {
      setCarregandoTela(false);
    }
  };

  useEffect(() => {
    carregarDevolucoes();
  }, []);

  const aoMudarFiltro = (setter, valor) => {
    setter(valor);
    setPaginaAtual(1);
  };

  const devolucoesResolvidas = useMemo(() => {
    return devolucoes.map((d) => {
      const funcionario = funcionarios.find(
        (f) => Number(f.id) === Number(d.idFuncionario)
      );
      const epi = epis.find((e) => Number(e.id) === Number(d.idEpi));
      const tamanho = tamanhos.find((t) => Number(t.id) === Number(d.idTamanho));
      const motivo = motivos.find((m) => Number(m.id) === Number(d.idMotivo));

      const epiNovo = epis.find((e) => Number(e.id) === Number(d.idEpiNovo));
      const tamanhoNovo = tamanhos.find(
        (t) => Number(t.id) === Number(d.idTamanhoNovo)
      );

      const houveTroca =
        Number(d.idEpiNovo || 0) > 0 ||
        Number(d.idTamanhoNovo || 0) > 0 ||
        Number(d.quantidadeNova || 0) > 0 ||
        !!d.nomeEpiNovoFallback ||
        !!d.novoTamanhoTextoFallback ||
        !!d.trocaLegada;

      return {
        ...d,
        funcionarioNome:
          funcionario?.nome || d.nomeFuncionarioFallback || "Desconhecido",
        funcionarioMatricula: funcionario?.matricula || "--",
        epiNome: epi?.nome || d.nomeEpiFallback || "EPI não identificado",
        tamanhoNome: tamanho?.tamanho || d.tamanhoTextoFallback || "-",
        motivoNome:
          motivo?.nome || d.motivoTextoFallback || "Motivo não identificado",
        houveTroca,
        epiNovoNome:
          epiNovo?.nome ||
          d.nomeEpiNovoFallback ||
          (houveTroca ? "EPI de troca" : ""),
        tamanhoNovoNome:
          tamanhoNovo?.tamanho || d.novoTamanhoTextoFallback || "-",
      };
    });
  }, [devolucoes, funcionarios, epis, tamanhos, motivos]);

  const devolucoesFiltradas = useMemo(() => {
    return filtrarDevolucoes(devolucoesResolvidas, {
      busca,
      filtroMotivo,
      filtroTroca,
      dataInicio,
      dataFim,
    });
  }, [devolucoesResolvidas, busca, filtroMotivo, filtroTroca, dataInicio, dataFim]);

  const devolucoesOrdenadas = useMemo(() => {
    return ordenarDevolucoesPorDataDesc(devolucoesFiltradas);
  }, [devolucoesFiltradas]);

  const resumoTela = useMemo(() => {
    return resumirDevolucoes(devolucoesOrdenadas);
  }, [devolucoesOrdenadas]);

  const paginacao = useMemo(() => {
    return paginarLista(devolucoesOrdenadas, paginaAtual, itensPorPagina);
  }, [devolucoesOrdenadas, paginaAtual]);

  const { totalPaginas, paginaSegura, itens: devolucoesVisiveis } = paginacao;

  useEffect(() => {
    if (paginaAtual !== paginaSegura) {
      setPaginaAtual(paginaSegura);
    }
  }, [paginaAtual, paginaSegura]);

  const handleAbrirRelatorioGeral = () => {
    abrirModalRelatorioGeral(devolucoesOrdenadas, dataInicio, dataFim);
  };

  const handleAbrirRelatorioFuncionario = (funcionario) => {
    const registrosFuncionario = devolucoesResolvidas.filter(
      (item) => Number(item.idFuncionario) === Number(funcionario?.id)
    );

    abrirModalRelatorioFuncionario(funcionario, registrosFuncionario);
  };

  const aoSalvarDevolucao = async (novaDevolucao) => {
    const itemLocal = normalizarDevolucao({
      id: novaDevolucao?.id ?? Date.now(),
      ...novaDevolucao,
    });

    setDevolucoes((prev) => {
      const semDuplicado = prev.filter(
        (item) => Number(item.id) !== Number(itemLocal.id)
      );
      return [itemLocal, ...semDuplicado];
    });

    setPaginaAtual(1);
    setModalAberto(false);
  };

  if (!podeVisualizar) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-amber-700">
          Você não tem permissão para visualizar a tela de devoluções.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            🔄 Devoluções e Trocas
          </h2>
          <p className="text-sm text-gray-500">
            Registre, filtre e imprima relatórios de devoluções conforme a tabela
            devolução.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button
            onClick={handleAbrirRelatorioGeral}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition shadow-sm border border-gray-300 flex items-center gap-2 justify-center w-full sm:w-auto"
          >
            <span>🖨️</span> Relatório
          </button>

          {podeCadastrar && (
            <button
              onClick={() => setModalAberto(true)}
              className="bg-red-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-800 transition flex items-center gap-2 shadow-sm justify-center w-full sm:w-auto"
            >
              <span>➕</span> Registrar Devolução
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <span className="text-[11px] text-red-700 uppercase font-bold tracking-wide block mb-1">
            Devoluções visíveis
          </span>
          <strong className="text-2xl text-red-900">
            {resumoTela.totalDevolucoes}
          </strong>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <span className="text-[11px] text-emerald-700 uppercase font-bold tracking-wide block mb-1">
            Com troca
          </span>
          <strong className="text-2xl text-emerald-900">
            {resumoTela.totalTrocas}
          </strong>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-[11px] text-slate-600 uppercase font-bold tracking-wide block mb-1">
            Sem troca
          </span>
          <strong className="text-2xl text-slate-800">
            {resumoTela.totalSemTroca}
          </strong>
        </div>
      </div>

      {erroTela ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erroTela}
        </div>
      ) : null}

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Buscar por funcionário, matrícula, item..."
            value={busca}
            onChange={(e) => aoMudarFiltro(setBusca, e.target.value)}
            className="xl:col-span-2 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
          />

          <select
            value={filtroMotivo}
            onChange={(e) => aoMudarFiltro(setFiltroMotivo, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
          >
            <option value="">Todos os motivos</option>
            {motivos.map((motivo) => (
              <option key={motivo.id} value={motivo.id}>
                {motivo.nome}
              </option>
            ))}
          </select>

          <select
            value={filtroTroca}
            onChange={(e) => aoMudarFiltro(setFiltroTroca, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
          >
            <option value="">Com e sem troca</option>
            <option value="comTroca">Somente com troca</option>
            <option value="semTroca">Somente sem troca</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => aoMudarFiltro(setDataInicio, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
            />

            <input
              type="date"
              value={dataFim}
              onChange={(e) => aoMudarFiltro(setDataFim, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
            />
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <div className="flex flex-wrap gap-2">
            {(busca || filtroMotivo || filtroTroca || dataInicio || dataFim) && (
              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  setFiltroMotivo("");
                  setFiltroTroca("");
                  setDataInicio("");
                  setDataFim("");
                  setPaginaAtual(1);
                }}
                className="text-xs text-red-500 font-bold hover:underline px-3 py-2"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {carregandoTela ? (
        <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
          Carregando devoluções.
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Funcionário</th>
                  <th className="p-4 font-semibold">Item Devolvido</th>
                  <th className="p-4 font-semibold">Motivo</th>
                  <th className="p-4 font-semibold text-center">Troca?</th>
                  <th className="p-4 font-semibold text-center">Assinatura</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {devolucoesVisiveis.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      Nenhuma devolução encontrada no banco de dados.
                    </td>
                  </tr>
                ) : (
                  devolucoesVisiveis.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-600 font-mono text-sm">
                        {formatarData(d.data_devolucao)}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleAbrirRelatorioFuncionario({
                              id: d.idFuncionario,
                              nome: d.funcionarioNome,
                              matricula: d.funcionarioMatricula,
                            })
                          }
                          className="text-left group"
                        >
                          <div className="font-bold text-red-700 group-hover:text-red-900 group-hover:underline transition">
                            {d.funcionarioNome}
                          </div>
                          <div className="text-xs text-gray-400">
                            Mat: {d.funcionarioMatricula}
                          </div>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-gray-800">
                          {d.epiNome}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tamanho: {d.tamanhoNome} • Qtd:{" "}
                          {Number(d.quantidadeADevolver || 0)}
                        </div>

                        {d.houveTroca && (
                          <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 inline-block">
                            Troca: {d.epiNovoNome} ({d.tamanhoNovoNome}) • Qtd:{" "}
                            {Number(d.quantidadeNova || 0)}
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-gray-700">{d.motivoNome}</td>

                      <td className="p-4 text-center">
                        {d.houveTroca ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            Sim
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            Não
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {d.assinatura_digital || d.token_validacao ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            Digital
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                            Física
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {devolucoesVisiveis.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                Nenhuma devolução encontrada no banco de dados.
              </div>
            ) : (
              devolucoesVisiveis.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                        Data
                      </div>
                      <div className="font-mono text-sm text-gray-700">
                        {formatarData(d.data_devolucao)}
                      </div>
                    </div>

                    <div>
                      {d.houveTroca ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          Com troca
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          Sem troca
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleAbrirRelatorioFuncionario({
                        id: d.idFuncionario,
                        nome: d.funcionarioNome,
                        matricula: d.funcionarioMatricula,
                      })
                    }
                    className="text-left mb-3"
                  >
                    <div className="font-bold text-red-700">
                      {d.funcionarioNome}
                    </div>
                    <div className="text-xs text-gray-400">
                      Mat: {d.funcionarioMatricula}
                    </div>
                  </button>

                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>Item:</strong> {d.epiNome} ({d.tamanhoNome})
                    </div>
                    <div>
                      <strong>Quantidade:</strong>{" "}
                      {Number(d.quantidadeADevolver || 0)}
                    </div>
                    <div>
                      <strong>Motivo:</strong> {d.motivoNome}
                    </div>

                    {d.houveTroca && (
                      <div>
                        <strong>Troca:</strong> {d.epiNovoNome} ({d.tamanhoNovoNome})
                        {" • "}Qtd: {Number(d.quantidadeNova || 0)}
                      </div>
                    )}

                    <div>
                      <strong>Assinatura:</strong>{" "}
                      {d.assinatura_digital || d.token_validacao
                        ? "Digital"
                        : "Física"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Página <strong>{paginaSegura}</strong> de <strong>{totalPaginas}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                disabled={paginaSegura <= 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <button
                type="button"
                onClick={() =>
                  setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
                }
                disabled={paginaSegura >= totalPaginas}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}

      <ModalBaixa
        aberto={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={aoSalvarDevolucao}
        funcionarios={funcionarios}
        epis={epis}
        tamanhos={tamanhos}
        motivos={motivos}
        tipo="devolucao"
      />

      <ModalPeriodoRelatorio
        aberto={modalPeriodoAberto}
        titulo={
          tipoRelatorioModal === "funcionario"
            ? "Gerar histórico individual"
            : "Gerar relatório geral"
        }
        inicio={periodoRelatorioInicio}
        fim={periodoRelatorioFim}
        erro={erroPeriodoModal}
        resumo={resumoModal}
        onChangeInicio={setPeriodoRelatorioInicio}
        onChangeFim={setPeriodoRelatorioFim}
        onClose={resetarModalPeriodo}
        onConfirmar={confirmarGeracaoRelatorio}
        onLimpar={limparDatasModal}
      />
    </div>
  );
}