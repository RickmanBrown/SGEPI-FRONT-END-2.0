import { useEffect, useMemo, useState } from "react";
import ModalNovoEpi from "../components/modals/ModalNovoEpi";
import ModalDetalhesEstoque from "../components/modals/ModalDetalhesEstoque";
import { temPermissao } from "../utils/permissoes";
import { formatarPreco, formatarValidade } from "../utils/estoqueFormatters";
import {
  calcularStatusValidade,
  getStatusColor,
  getStatusTexto,
  getValidadeBadge,
  getValidadeTexto,
  filtrarEstoque,
  ordenarEstoquePorNome,
  resumirEstoque,
  paginarLista,
} from "../utils/estoqueHelpers";
import {
  carregarDadosEstoque,
  obterDadosMockEstoque,
} from "../services/estoqueService";

function Estoque({ usuarioLogado }) {
  const [epis, setEpis] = useState([]);
  const [tiposProtecao, setTiposProtecao] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);
  const [entradas, setEntradas] = useState([]);

  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erroTela, setErroTela] = useState("");
  const [itemDetalhe, setItemDetalhe] = useState(null);

  const itensPorPagina = 6;

  const podeVisualizar = temPermissao(usuarioLogado, [
    "admin",
    "tecnico",
    "almoxarife",
    "colaborador",
  ]);

  const perfilUsuario = String(
    usuarioLogado?.perfil || usuarioLogado?.role || "colaborador"
  )
    .trim()
    .toLowerCase();

  const isAdmin = perfilUsuario === "admin";

  const carregarProdutos = async () => {
    setCarregando(true);
    setErroTela("");

    try {
      const dados = await carregarDadosEstoque();
      setTiposProtecao(dados.tiposProtecao);
      setTamanhos(dados.tamanhos);
      setEpis(dados.epis);
      setEntradas(dados.entradas);
    } catch (erro) {
      console.error("Erro ao carregar estoque:", erro);
      setErroTela(
        erro?.message || "Não foi possível carregar os dados do estoque."
      );

      const dadosMock = obterDadosMockEstoque();
      setTiposProtecao(dadosMock.tiposProtecao);
      setTamanhos(dadosMock.tamanhos);
      setEpis(dadosMock.epis);
      setEntradas(dadosMock.entradas);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const estoqueNormalizado = useMemo(() => {
    return entradas.map((entrada) => {
      const epi = epis.find((item) => item.id === entrada.idEpi);
      const tamanho = tamanhos.find((item) => item.id === entrada.idTamanho);
      const tipo = tiposProtecao.find(
        (item) => item.id === Number(epi?.idTipoProtecao ?? 0)
      );

      return {
        id: entrada.id,
        nome: epi?.nome ?? "EPI não encontrado",
        fabricante: epi?.fabricante ?? "-",
        ca: epi?.CA ?? "-",
        descricao: epi?.descricao ?? "",
        tipoProtecao: tipo?.nome ?? "-",
        lote: entrada.lote || "-",
        tamanho: tamanho?.tamanho || "-",
        preco: entrada.valor_unitario || 0,
        quantidadeInicial: entrada.quantidade || 0,
        quantidadeAtual: entrada.quantidadeAtual || 0,
        validade: entrada.data_validade || epi?.validade_CA || null,
        alertaMinimo: Number(epi?.alerta_minimo ?? 0),
        valorTotal:
          Number(entrada.quantidadeAtual || 0) *
          Number(entrada.valor_unitario || 0),
      };
    });
  }, [entradas, epis, tamanhos, tiposProtecao]);

  const listaFiltrada = useMemo(() => {
    return filtrarEstoque(estoqueNormalizado, busca);
  }, [estoqueNormalizado, busca]);

  const listaOrdenada = useMemo(() => {
    return ordenarEstoquePorNome(listaFiltrada);
  }, [listaFiltrada]);

  const resumo = useMemo(() => {
    return resumirEstoque(estoqueNormalizado);
  }, [estoqueNormalizado]);

  const paginacao = useMemo(() => {
    return paginarLista(listaOrdenada, paginaAtual, itensPorPagina);
  }, [listaOrdenada, paginaAtual]);

  const { totalPaginas, paginaSegura, itens: itensVisiveis } = paginacao;

  useEffect(() => {
    if (paginaAtual !== paginaSegura) {
      setPaginaAtual(paginaSegura);
    }
  }, [paginaAtual, paginaSegura]);

  if (!podeVisualizar) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 max-w-full relative">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-amber-700">
          Você não tem permissão para visualizar a tela de estoque.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 max-w-full relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
              📦 Controle de Estoque
            </h2>
            <p className="text-sm text-gray-500">
              Visualize lotes, tamanhos, preços e quantidades das entradas de estoque.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {isAdmin && (
              <button
                onClick={() => setModalAberto(true)}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto"
              >
                + Novo EPI
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
          <ResumoCard label="Lotes" value={carregando ? "--" : resumo.totalLotes} />
          <ResumoCard
            label="Itens em estoque"
            value={carregando ? "--" : resumo.totalItens}
            className="border-blue-200 bg-blue-50 text-blue-800"
            labelClassName="text-blue-600"
          />
          <ResumoCard
            label="Estoque baixo"
            value={carregando ? "--" : resumo.estoqueBaixo}
            className="border-yellow-200 bg-yellow-50 text-yellow-800"
            labelClassName="text-yellow-700"
          />
          <ResumoCard
            label="Sem estoque"
            value={carregando ? "--" : resumo.semEstoque}
            className="border-red-200 bg-red-50 text-red-800"
            labelClassName="text-red-700"
          />
          <ResumoCard
            label="Valor estimado"
            value={carregando ? "--" : formatarPreco(resumo.valorTotal)}
            className="border-emerald-200 bg-emerald-50 text-emerald-800"
            labelClassName="text-emerald-700"
            valueClassName="text-lg md:text-2xl"
          />
        </div>

        {erroTela && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {erroTela}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por nome, fabricante, CA, lote, tamanho ou tipo..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm lg:text-base"
            />
          </div>
        </div>

        {carregando ? (
          <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
            Carregando estoque...
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">EPI</th>
                    <th className="p-4 font-semibold">Tipo / CA</th>
                    <th className="p-4 font-semibold text-center">Lote</th>
                    <th className="p-4 font-semibold text-center">Tamanho</th>
                    <th className="p-4 font-semibold text-center">Preço Unit.</th>
                    <th className="p-4 font-semibold text-center">Qtd. Atual</th>
                    <th className="p-4 font-semibold text-center">Validade</th>
                    <th className="p-4 font-semibold text-center">Detalhes</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {itensVisiveis.length > 0 ? (
                    itensVisiveis.map((item) => {
                      const validadeStatus = calcularStatusValidade(item.validade);

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="p-4">
                            <div className="font-medium text-gray-800">{item.nome}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {item.fabricante || "-"}
                            </div>
                          </td>

                          <td className="p-4 text-gray-600 text-sm">
                            {item.tipoProtecao || "-"} <br />
                            <span className="text-xs text-gray-400">
                              CA: {item.ca || "-"}
                            </span>
                          </td>

                          <td className="p-4 text-center text-gray-500 font-mono text-xs">
                            {item.lote || "-"}
                          </td>

                          <td className="p-4 text-center text-gray-600 text-sm">
                            {item.tamanho || "-"}
                          </td>

                          <td className="p-4 text-center text-gray-600 text-sm">
                            {formatarPreco(item.preco)}
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`px-2 py-1 rounded font-bold border ${getStatusColor(
                                  item.quantidadeAtual,
                                  item.alertaMinimo
                                )}`}
                              >
                                {item.quantidadeAtual}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {getStatusTexto(item.quantidadeAtual, item.alertaMinimo)}
                              </span>
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-gray-500 text-sm">
                                {formatarValidade(item.validade)}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-[10px] font-bold border ${getValidadeBadge(
                                  validadeStatus
                                )}`}
                              >
                                {getValidadeTexto(validadeStatus)}
                              </span>
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => setItemDetalhe(item)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                            >
                              Ver mais
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-gray-500">
                        Nenhum item de estoque cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {itensVisiveis.length > 0 ? (
                itensVisiveis.map((item) => {
                  const validadeStatus = calcularStatusValidade(item.validade);

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative"
                    >
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusColor(
                            item.quantidadeAtual,
                            item.alertaMinimo
                          )}`}
                        >
                          Qtd: {item.quantidadeAtual}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 text-lg mb-1 pr-20">
                        {item.nome}
                      </h3>

                      <p className="text-xs text-gray-500 mb-1">
                        {item.tipoProtecao || "-"}
                      </p>

                      <p className="text-xs text-gray-400 mb-3">
                        {item.fabricante || "-"} • CA: {item.ca || "-"}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 border-t pt-2">
                        <div>
                          <span className="font-semibold text-gray-400 text-xs">Lote:</span>{" "}
                          {item.lote || "-"}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-400 text-xs">Tamanho:</span>{" "}
                          {item.tamanho || "-"}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-400 text-xs">Validade:</span>{" "}
                          {formatarValidade(item.validade)}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-400 text-xs">Preço:</span>{" "}
                          {formatarPreco(item.preco)}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold border ${getValidadeBadge(
                            validadeStatus
                          )}`}
                        >
                          {getValidadeTexto(validadeStatus)}
                        </span>

                        <button
                          type="button"
                          onClick={() => setItemDetalhe(item)}
                          className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition"
                        >
                          Ver detalhes
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  Nenhum item de estoque cadastrado.
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
                      : "bg-white text-blue-700 hover:bg-blue-50 border-blue-200"
                  }`}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}

        {modalAberto && isAdmin && (
          <ModalNovoEpi
            onClose={() => setModalAberto(false)}
            onSalvar={async () => {
              setModalAberto(false);
              await carregarProdutos();
              setPaginaAtual(1);
            }}
          />
        )}
      </div>

      <ModalDetalhesEstoque
        aberto={!!itemDetalhe}
        item={itemDetalhe}
        onClose={() => setItemDetalhe(null)}
      />
    </>
  );
}

function ResumoCard({
  label,
  value,
  className = "border-slate-200 bg-slate-50 text-slate-800",
  labelClassName = "text-slate-500",
  valueClassName = "text-2xl",
}) {
  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      <span className={`text-[11px] uppercase tracking-wide font-bold block mb-1 ${labelClassName}`}>
        {label}
      </span>
      <strong className={valueClassName}>{value}</strong>
    </div>
  );
}

export default Estoque;