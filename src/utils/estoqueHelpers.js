export function calcularStatusValidade(dataString) {
  if (!dataString) return "normal";

  const hoje = new Date();
  const validade = new Date(dataString);

  hoje.setHours(0, 0, 0, 0);
  validade.setHours(0, 0, 0, 0);

  if (Number.isNaN(validade.getTime())) return "normal";

  const diffMs = validade.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return "vencido";
  if (diffDias <= 30) return "proximo";
  return "normal";
}

export function getStatusColor(quantidadeAtual, alertaMinimo) {
  if (quantidadeAtual <= 0) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  if (quantidadeAtual <= Number(alertaMinimo || 0)) {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  return "bg-green-100 text-green-700 border-green-200";
}

export function getStatusTexto(quantidadeAtual, alertaMinimo) {
  if (quantidadeAtual <= 0) return "Sem estoque";
  if (quantidadeAtual <= Number(alertaMinimo || 0)) return "Estoque baixo";
  return "Normal";
}

export function getValidadeBadge(status) {
  if (status === "vencido") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  if (status === "proximo") {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

export function getValidadeTexto(status) {
  if (status === "vencido") return "Vencido";
  if (status === "proximo") return "Próx. venc.";
  return "Regular";
}

export function filtrarEstoque(lista, busca = "") {
  const termo = busca.toLowerCase().trim();

  if (!termo) return lista;

  return lista.filter((item) => {
    return (
      (item.nome || "").toLowerCase().includes(termo) ||
      (item.fabricante || "").toLowerCase().includes(termo) ||
      (item.ca || "").toLowerCase().includes(termo) ||
      (item.tipoProtecao || "").toLowerCase().includes(termo) ||
      (item.lote || "").toLowerCase().includes(termo) ||
      (item.tamanho || "").toLowerCase().includes(termo) ||
      (item.descricao || "").toLowerCase().includes(termo)
    );
  });
}

export function ordenarEstoquePorNome(lista) {
  return [...lista].sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
}

export function resumirEstoque(lista) {
  const totalLotes = lista.length;
  const totalItens = lista.reduce(
    (acc, item) => acc + Number(item.quantidadeAtual || 0),
    0
  );

  const estoqueBaixo = lista.filter(
    (item) =>
      Number(item.quantidadeAtual || 0) > 0 &&
      Number(item.quantidadeAtual || 0) <= Number(item.alertaMinimo || 0)
  ).length;

  const semEstoque = lista.filter(
    (item) => Number(item.quantidadeAtual || 0) <= 0
  ).length;

  const valorTotal = lista.reduce(
    (acc, item) => acc + Number(item.valorTotal || 0),
    0
  );

  return {
    totalLotes,
    totalItens,
    estoqueBaixo,
    semEstoque,
    valorTotal,
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