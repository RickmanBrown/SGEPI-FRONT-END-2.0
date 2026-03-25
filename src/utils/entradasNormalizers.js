export function extrairLista(resp, fallback = []) {
  const dados = resp?.data ?? resp ?? fallback;
  return Array.isArray(dados) ? dados : fallback;
}

export function normalizarFornecedor(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    razao_social: item?.razao_social ?? item?.razaoSocial ?? item?.nome ?? "",
    nome_fantasia: item?.nome_fantasia ?? item?.nomeFantasia ?? "",
    cnpj: item?.cnpj ?? "",
    inscricao_estadual:
      item?.inscricao_estadual ?? item?.inscricaoEstadual ?? "",
  };
}

export function normalizarEpi(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    nome: item?.nome ?? item?.Nome ?? "",
    fabricante: item?.fabricante ?? "",
    CA: item?.CA ?? item?.ca ?? "",
  };
}

export function normalizarTamanho(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    tamanho: String(item?.tamanho ?? item?.Tamanho ?? ""),
  };
}

export function normalizarEntrada(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    idEpi: Number(
      item?.idEpi ??
        item?.epi_id ??
        item?.epiId ??
        item?.id_epi ??
        item?.idProduto ??
        item?.produto_id ??
        item?.produto?.id ??
        item?.epi?.id ??
        0
    ),
    idTamanho: Number(
      item?.idTamanho ??
        item?.tamanho_id ??
        item?.tamanhoId ??
        item?.id_tamanho ??
        item?.tamanho?.id ??
        0
    ),
    idFornecedor: Number(
      item?.idFornecedor ??
        item?.fornecedor_id ??
        item?.fornecedorId ??
        item?.id_fornecedor ??
        item?.fornecedor?.id ??
        0
    ),
    data_entrada: item?.data_entrada ?? item?.dataEntrada ?? "",
    quantidade: Number(item?.quantidade ?? 0),
    quantidadeAtual: Number(
      item?.quantidadeAtual ??
        item?.quantidade_atual ??
        item?.estoqueAtual ??
        item?.estoque_atual ??
        item?.quantidade ??
        0
    ),
    data_fabricacao: item?.data_fabricacao ?? item?.dataFabricacao ?? "",
    data_validade:
      item?.data_validade ?? item?.dataValidade ?? item?.validade ?? "",
    lote: item?.lote ?? "",
    valor_unitario: Number(item?.valor_unitario ?? item?.valorUnitario ?? 0),
    nota_fiscal_numero:
      item?.nota_fiscal_numero ?? item?.notaFiscalNumero ?? "",
    nota_fiscal_serie:
      item?.nota_fiscal_serie ?? item?.notaFiscalSerie ?? "",
  };
}