export function extrairLista(resp, fallback = []) {
  const dados = resp?.data ?? resp ?? fallback;
  return Array.isArray(dados) ? dados : fallback;
}

export function normalizarFuncionario(item) {
  return {
    id: Number(item?.id ?? 0),
    nome: item?.nome ?? "",
    matricula: String(item?.matricula ?? ""),
  };
}

export function normalizarEpi(item) {
  return {
    id: Number(item?.id ?? 0),
    nome: item?.nome ?? "",
  };
}

export function normalizarTamanho(item) {
  return {
    id: Number(item?.id ?? 0),
    tamanho: String(item?.tamanho ?? ""),
  };
}

export function normalizarMotivo(item) {
  return {
    id: Number(item?.id ?? 0),
    nome: item?.nome ?? item?.descricao ?? "",
  };
}

export function normalizarDevolucao(item) {
  const trocaLegada = item?.troca || null;

  return {
    id: Number(item?.id ?? Date.now() + Math.random()),

    idFuncionario: Number(
      item?.idFuncionario ??
        item?.funcionario_id ??
        item?.funcionarioId ??
        item?.id_funcionario ??
        item?.funcionario ??
        item?.funcionario?.id ??
        0
    ),

    idEpi: Number(
      item?.idEpi ??
        item?.epi_id ??
        item?.epiId ??
        item?.id_epi ??
        item?.epi ??
        item?.epi?.id ??
        0
    ),

    idMotivo: Number(
      item?.idMotivo ??
        item?.motivo_id ??
        item?.motivoId ??
        item?.id_motivo ??
        item?.motivo?.id ??
        0
    ),

    data_devolucao:
      item?.data_devolucao ??
      item?.dataDevolucao ??
      item?.data ??
      "",

    idTamanho: Number(
      item?.idTamanho ??
        item?.tamanho_id ??
        item?.tamanhoId ??
        item?.id_tamanho ??
        0
    ),

    quantidadeADevolver: Number(
      item?.quantidadeADevolver ??
        item?.quantidade_a_devolver ??
        item?.quantidade ??
        0
    ),

    idEpiNovo: Number(
      item?.idEpiNovo ??
        item?.epi_novo_id ??
        item?.epiNovoId ??
        trocaLegada?.novoEpi ??
        0
    ),

    idTamanhoNovo: Number(
      item?.idTamanhoNovo ??
        item?.tamanho_novo_id ??
        item?.tamanhoNovoId ??
        0
    ),

    quantidadeNova: Number(
      item?.quantidadeNova ??
        item?.quantidade_nova ??
        trocaLegada?.novaQuantidade ??
        0
    ),

    assinatura_digital:
      item?.assinatura_digital ??
      item?.assinaturaDigital ??
      item?.assinatura ??
      null,

    token_validacao:
      item?.token_validacao ??
      item?.tokenValidacao ??
      null,

    observacao:
      item?.observacao ??
      item?.observacoes ??
      item?.obs ??
      "",

    motivoTextoFallback:
      typeof item?.motivo === "string"
        ? item.motivo
        : item?.motivo?.nome || "",

    tamanhoTextoFallback:
      typeof item?.tamanho === "string"
        ? item.tamanho
        : "",

    novoTamanhoTextoFallback:
      trocaLegada?.novoTamanho ??
      item?.novoTamanho ??
      "",

    nomeFuncionarioFallback:
      item?.nome_funcionario ??
      item?.funcionarioNome ??
      item?.funcionario?.nome ??
      "",

    nomeEpiFallback:
      item?.nome_epi ??
      item?.epiNome ??
      item?.epi?.nome ??
      "",

    nomeEpiNovoFallback:
      item?.nome_epi_novo ??
      item?.epiNovoNome ??
      item?.epiNovo?.nome ??
      "",

    trocaLegada,
  };
}