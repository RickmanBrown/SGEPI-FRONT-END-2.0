export function extrairLista(resp, fallback = []) {
  const dados = resp?.data ?? resp ?? fallback;
  return Array.isArray(dados) ? dados : fallback;
}

export function normalizarFuncionario(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    nome: item?.nome ?? item?.Nome ?? "",
    matricula: String(item?.matricula ?? item?.Matricula ?? ""),
  };
}

export function normalizarEpi(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    nome: item?.nome ?? item?.Nome ?? "",
  };
}

export function normalizarTamanho(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    tamanho: String(item?.tamanho ?? item?.Tamanho ?? ""),
  };
}

export function normalizarEntrega(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    idFuncionario: Number(
      item?.idFuncionario ??
        item?.funcionario_id ??
        item?.funcionarioId ??
        item?.funcionario ??
        item?.id_funcionario ??
        item?.funcionario?.id ??
        0
    ),
    data_entrega:
      item?.data_entrega ??
      item?.dataEntrega ??
      item?.data_entrega_epi ??
      item?.data ??
      null,
    assinatura:
      item?.assinatura ??
      item?.assinatura_digital ??
      item?.assinaturaDigital ??
      null,
    token_validacao: item?.token_validacao ?? item?.tokenValidacao ?? null,
    itens: Array.isArray(item?.itens) ? item.itens : [],
  };
}

export function normalizarItemEntregue(item) {
  return {
    id: item?.id ?? `${Date.now()}-${Math.random()}`,
    idEntrega: Number(
      item?.idEntrega ??
        item?.entrega_id ??
        item?.entregaId ??
        item?.id_entrega ??
        0
    ),
    idEpi: Number(
      item?.idEpi ??
        item?.epi_id ??
        item?.epiId ??
        item?.id_epi ??
        item?.produto_id ??
        0
    ),
    idTamanho: Number(
      item?.idTamanho ??
        item?.tamanho_id ??
        item?.tamanhoId ??
        item?.id_tamanho ??
        0
    ),
    quantidade: Number(item?.quantidade ?? 0),
    epiNome: item?.epiNome ?? item?.epi_nome ?? null,
    tamanhoTexto: item?.tamanho ?? item?.tamanhoTexto ?? null,
  };
}