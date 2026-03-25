export function filtrarEntradas(lista, busca = "") {
  const termo = String(busca).toLowerCase().trim();

  if (!termo) return lista;

  return lista.filter((e) => {
    return (
      String(e.epiNome || "").toLowerCase().includes(termo) ||
      String(e.epiFabricante || "").toLowerCase().includes(termo) ||
      String(e.epiCA || "").toLowerCase().includes(termo) ||
      String(e.fornecedorNome || "").toLowerCase().includes(termo) ||
      String(e.lote || "").toLowerCase().includes(termo) ||
      String(e.nota_fiscal_numero || "").toLowerCase().includes(termo) ||
      String(e.nota_fiscal_serie || "").toLowerCase().includes(termo) ||
      String(e.tamanhoNome || "").toLowerCase().includes(termo)
    );
  });
}

export function ordenarEntradasPorDataDesc(lista) {
  return [...lista].sort((a, b) => {
    if (a.data_entrada < b.data_entrada) return 1;
    if (a.data_entrada > b.data_entrada) return -1;
    return 0;
  });
}

export function resumirEntradas(lista) {
  return {
    totalRegistros: lista.length,
    totalItens: lista.reduce(
      (acc, item) => acc + Number(item.quantidade || 0),
      0
    ),
    valorTotal: lista.reduce(
      (acc, item) =>
        acc + Number(item.quantidade || 0) * Number(item.valor_unitario || 0),
      0
    ),
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