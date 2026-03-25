// src/pages/Funcionarios.jsx

import { useEffect, useMemo, useState } from "react";
import { temPermissao } from "../utils/permissoes";
import ModalDetalhesFuncionario from "../components/modals/ModalDetalhesFuncionario";
import {
  resolverFuncionarios,
  filtrarFuncionarios,
  resumirFuncionarios,
  paginarLista,
} from "../utils/funcionariosHelpers";
import {
  carregarDadosFuncionarios,
  obterDadosMockFuncionarios,
} from "../services/funcionarioService";

function Funcionarios({ usuarioLogado }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [devolucoes, setDevolucoes] = useState([]);

  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erroTela, setErroTela] = useState("");
  const [funcionarioDetalhe, setFuncionarioDetalhe] = useState(null);

  const itensPorPagina = 6;

  const podeVisualizar = temPermissao(usuarioLogado, [
    "admin",
    "tecnico",
    "almoxarife",
    "colaborador",
  ]);

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErroTela("");

      try {
        const dados = await carregarDadosFuncionarios();

        setFuncionarios(dados.funcionarios);
        setDepartamentos(dados.departamentos);
        setFuncoes(dados.funcoes);
        setEntregas(dados.entregas);
        setDevolucoes(dados.devolucoes);
      } catch (erro) {
        setErroTela(
          erro?.message || "Não foi possível carregar a tela de funcionários."
        );

        const dadosMock = obterDadosMockFuncionarios();

        setFuncionarios(dadosMock.funcionarios);
        setDepartamentos(dadosMock.departamentos);
        setFuncoes(dadosMock.funcoes);
        setEntregas(dadosMock.entregas);
        setDevolucoes(dadosMock.devolucoes);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const funcionariosResolvidos = useMemo(() => {
    return resolverFuncionarios(
      funcionarios,
      departamentos,
      funcoes,
      entregas,
      devolucoes
    );
  }, [funcionarios, departamentos, funcoes, entregas, devolucoes]);

  const funcionariosFiltrados = useMemo(() => {
    return filtrarFuncionarios(funcionariosResolvidos, busca);
  }, [funcionariosResolvidos, busca]);

  const paginacao = useMemo(() => {
    return paginarLista(funcionariosFiltrados, paginaAtual, itensPorPagina);
  }, [funcionariosFiltrados, paginaAtual]);

  const { totalPaginas, paginaSegura, itens: funcionariosVisiveis } = paginacao;

  useEffect(() => {
    if (paginaAtual !== paginaSegura) {
      setPaginaAtual(paginaSegura);
    }
  }, [paginaAtual, paginaSegura]);

  const resumo = useMemo(() => {
    return resumirFuncionarios(funcionariosResolvidos);
  }, [funcionariosResolvidos]);

  if (!podeVisualizar) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-amber-700">
          Você não tem permissão para visualizar a tela de funcionários.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in max-w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
              👥 Funcionários
            </h2>
            <p className="text-sm text-gray-500">
              Consulte colaboradores, setor, função e movimentações no sistema.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">
              Total de funcionários
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {carregando ? "--" : resumo.totalFuncionarios}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-4">
            <p className="text-xs text-blue-600 uppercase font-bold tracking-wide">
              Departamentos ativos
            </p>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              {carregando ? "--" : resumo.departamentosAtivos}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4">
            <p className="text-xs text-emerald-600 uppercase font-bold tracking-wide">
              Com movimentação
            </p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">
              {carregando ? "--" : resumo.comMovimentacao}
            </p>
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
            placeholder="Buscar por nome, matrícula, departamento ou função..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm lg:text-base"
          />
        </div>

        {carregando ? (
          <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
            Carregando funcionários...
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Funcionário</th>
                    <th className="p-4 font-semibold">Departamento</th>
                    <th className="p-4 font-semibold">Função</th>
                    <th className="p-4 font-semibold text-center">Entregas</th>
                    <th className="p-4 font-semibold text-center">Devoluções</th>
                    <th className="p-4 font-semibold">Última movimentação</th>
                    <th className="p-4 font-semibold text-center">Detalhes</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {funcionariosVisiveis.length > 0 ? (
                    funcionariosVisiveis.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{f.nome}</div>
                          <div className="text-xs text-gray-400">
                            Matrícula: {f.matricula}
                          </div>
                        </td>

                        <td className="p-4 text-gray-600">{f.departamentoNome}</td>

                        <td className="p-4 text-gray-600">{f.funcaoNome}</td>

                        <td className="p-4 text-center">
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                            {f.totalEntregas}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                            {f.totalDevolucoes}
                          </span>
                        </td>

                        <td className="p-4 text-gray-600">{f.ultimaMovimentacao}</td>

                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => setFuncionarioDetalhe(f)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                          >
                            Ver mais
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500">
                        Nenhum funcionário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {funcionariosVisiveis.length > 0 ? (
                funcionariosVisiveis.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{f.nome}</h3>
                        <p className="text-xs text-gray-400">
                          Matrícula: {f.matricula}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFuncionarioDetalhe(f)}
                        className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
                      >
                        Ver
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">
                          Departamento
                        </span>
                        <span className="text-gray-700">{f.departamentoNome}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">
                          Função
                        </span>
                        <span className="text-gray-700">{f.funcaoNome}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-blue-500 font-bold uppercase">
                          Entregas
                        </span>
                        <span className="text-blue-700 font-bold">
                          {f.totalEntregas}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-red-500 font-bold uppercase">
                          Devoluções
                        </span>
                        <span className="text-red-700 font-bold">
                          {f.totalDevolucoes}
                        </span>
                      </div>

                      <div className="col-span-2 pt-2 border-t border-gray-200">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">
                          Última movimentação
                        </span>
                        <span className="text-gray-700">
                          {f.ultimaMovimentacao}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  Nenhum funcionário encontrado.
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
                      : "bg-white text-blue-700 hover:bg-blue-50 border-blue-200"
                  }`}
                >
                  ← Anterior
                </button>

                <span className="text-xs lg:text-sm text-gray-600">
                  Pág. <b className="text-gray-900">{paginaSegura}</b> de{" "}
                  <b>{totalPaginas}</b>
                </span>

                <button
                  onClick={() =>
                    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
                  }
                  disabled={paginaSegura === totalPaginas}
                  className={`px-4 py-2 rounded text-sm font-bold border ${
                    paginaSegura === totalPaginas
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-700 hover:bg-blue-50 border-blue-200"
                  }`}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ModalDetalhesFuncionario
        aberto={!!funcionarioDetalhe}
        funcionario={funcionarioDetalhe}
        onClose={() => setFuncionarioDetalhe(null)}
      />
    </>
  );
}

export default Funcionarios;