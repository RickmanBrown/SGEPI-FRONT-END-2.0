export function filtrarPorPeriodo(lista, inicio, fim) {
  return lista.filter((item) => {
    const data = String(item?.data_devolucao || "").substring(0, 10);

    if (!data) return !inicio && !fim;
    if (inicio && data < inicio) return false;
    if (fim && data > fim) return false;

    return true;
  });
}

export function filtrarDevolucoes(lista, filtros = {}) {
  const {
    busca = "",
    filtroMotivo = "",
    filtroTroca = "",
    dataInicio = "",
    dataFim = "",
  } = filtros;

  const termo = busca.trim().toLowerCase();

  return lista.filter((d) => {
    const correspondeBusca =
      !termo ||
      String(d.funcionarioNome || "").toLowerCase().includes(termo) ||
      String(d.funcionarioMatricula || "").toLowerCase().includes(termo) ||
      String(d.epiNome || "").toLowerCase().includes(termo) ||
      String(d.motivoNome || "").toLowerCase().includes(termo) ||
      String(d.epiNovoNome || "").toLowerCase().includes(termo) ||
      String(d.tamanhoNome || "").toLowerCase().includes(termo) ||
      String(d.tamanhoNovoNome || "").toLowerCase().includes(termo) ||
      String(d.observacao || "").toLowerCase().includes(termo);

    const correspondeMotivo =
      !filtroMotivo || String(d.idMotivo) === String(filtroMotivo);

    const correspondeTroca =
      !filtroTroca ||
      (filtroTroca === "comTroca" && d.houveTroca) ||
      (filtroTroca === "semTroca" && !d.houveTroca);

    const data = String(d.data_devolucao || "").substring(0, 10);
    const correspondeDataInicio = !dataInicio || (data && data >= dataInicio);
    const correspondeDataFim = !dataFim || (data && data <= dataFim);

    return (
      correspondeBusca &&
      correspondeMotivo &&
      correspondeTroca &&
      correspondeDataInicio &&
      correspondeDataFim
    );
  });
}

export function ordenarDevolucoesPorDataDesc(lista) {
  return [...lista].sort((a, b) => {
    if (a.data_devolucao < b.data_devolucao) return 1;
    if (a.data_devolucao > b.data_devolucao) return -1;
    return 0;
  });
}

export function resumirDevolucoes(lista) {
  const totalDevolucoes = lista.length;
  const totalTrocas = lista.filter((item) => item.houveTroca).length;

  return {
    totalDevolucoes,
    totalTrocas,
    totalSemTroca: totalDevolucoes - totalTrocas,
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