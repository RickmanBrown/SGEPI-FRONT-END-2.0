export function filtrarEntregasPorPeriodo(lista, inicio, fim) {
  return lista.filter((entrega) => {
    const data = String(entrega?.dataEntrega || "").substring(0, 10);

    if (!data) return !inicio && !fim;
    if (inicio && data < inicio) return false;
    if (fim && data > fim) return false;

    return true;
  });
}

export function totalItensDaLista(lista) {
  return lista.reduce((acc, entrega) => {
    const subtotal = (entrega?.itens || []).reduce(
      (soma, item) => soma + Number(item?.quantidade ?? 0),
      0
    );
    return acc + subtotal;
  }, 0);
}

export function totalTiposDaLista(lista) {
  const tipos = new Set();

  lista.forEach((entrega) => {
    (entrega?.itens || []).forEach((item) => {
      tipos.add(`${item?.epiNome || ""}::${item?.tamanho || ""}`);
    });
  });

  return tipos.size;
}

export function filtrarEntregas(lista, busca = "", dataInicio = "", dataFim = "") {
  const termo = busca.toLowerCase().trim();

  return lista.filter((entrega) => {
    const nomeFuncionario = (entrega.funcionario?.nome || "").toLowerCase();
    const matricula = String(entrega.funcionario?.matricula || "");

    const matchTexto =
      !termo ||
      nomeFuncionario.includes(termo) ||
      matricula.includes(termo) ||
      entrega.itens.some(
        (item) =>
          (item.epiNome || "").toLowerCase().includes(termo) ||
          String(item.tamanho || "").toLowerCase().includes(termo)
      );

    let matchData = true;

    if (dataInicio) matchData = matchData && entrega.dataEntrega >= dataInicio;
    if (dataFim) matchData = matchData && entrega.dataEntrega <= dataFim;

    return matchTexto && matchData;
  });
}

export function ordenarEntregasPorDataDesc(lista) {
  return [...lista].sort((a, b) => {
    if (a.dataEntrega > b.dataEntrega) return -1;
    if (a.dataEntrega < b.dataEntrega) return 1;
    return 0;
  });
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