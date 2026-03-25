import { formatarData } from "./funcionariosFormatters";

export function resolverFuncionarios(
  funcionarios,
  departamentos,
  funcoes,
  entregas,
  devolucoes
) {
  return funcionarios.map((funcionario) => {
    const departamento = departamentos.find(
      (dep) => Number(dep.id) === Number(funcionario.idDepartamento)
    );

    const funcao = funcoes.find(
      (fn) => Number(fn.id) === Number(funcionario.idFuncao)
    );

    const entregasDoFuncionario = entregas.filter(
      (entrega) => Number(entrega.idFuncionario) === Number(funcionario.id)
    );

    const devolucoesDoFuncionario = devolucoes.filter(
      (devolucao) => Number(devolucao.idFuncionario) === Number(funcionario.id)
    );

    const datasMovimentacao = [
      ...entregasDoFuncionario.map((item) => item.data_entrega),
      ...devolucoesDoFuncionario.map((item) => item.data_devolucao),
    ]
      .filter(Boolean)
      .sort((a, b) => String(b).localeCompare(String(a)));

    return {
      ...funcionario,
      departamentoNome: departamento?.nome || "-",
      funcaoNome: funcao?.nome || "-",
      totalEntregas: entregasDoFuncionario.length,
      totalDevolucoes: devolucoesDoFuncionario.length,
      ultimaMovimentacao: datasMovimentacao.length
        ? formatarData(datasMovimentacao[0])
        : "-",
      entregasDoFuncionario,
      devolucoesDoFuncionario,
    };
  });
}

export function filtrarFuncionarios(lista, busca = "") {
  const termo = busca.toLowerCase().trim();

  const listaOrdenada = [...lista].sort((a, b) =>
    (a.nome || "").localeCompare(b.nome || "")
  );

  if (!termo) return listaOrdenada;

  return listaOrdenada.filter((f) => {
    return (
      (f.nome || "").toLowerCase().includes(termo) ||
      String(f.matricula || "").includes(termo) ||
      (f.departamentoNome || "").toLowerCase().includes(termo) ||
      (f.funcaoNome || "").toLowerCase().includes(termo)
    );
  });
}

export function resumirFuncionarios(lista) {
  const totalFuncionarios = lista.length;

  const departamentosAtivos = new Set(
    lista
      .map((item) => item.departamentoNome)
      .filter((item) => item && item !== "-")
  ).size;

  const comMovimentacao = lista.filter(
    (item) => item.totalEntregas > 0 || item.totalDevolucoes > 0
  ).length;

  return {
    totalFuncionarios,
    departamentosAtivos,
    comMovimentacao,
  };
}

export function paginarLista(lista, paginaAtual = 1, itensPorPagina = 10) {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / itensPorPagina));
  const paginaSegura = Math.min(Math.max(1, paginaAtual), totalPaginas);

  const inicio = (paginaSegura - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  return {
    totalPaginas,
    paginaSegura,
    itens: lista.slice(inicio, fim),
  };
}