export function extrairLista(resp, fallback = []) {
  const dados = resp?.data ?? resp ?? fallback;
  return Array.isArray(dados) ? dados : fallback;
}

export function normalizarFuncionario(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    nome: item?.nome ?? item?.Nome ?? "",
    matricula: String(item?.matricula ?? item?.Matricula ?? ""),
    idDepartamento: Number(
      item?.idDepartamento ??
        item?.departamento_id ??
        item?.departamentoId ??
        item?.id_departamento ??
        item?.departamento?.id ??
        0
    ),
    idFuncao: Number(
      item?.idFuncao ??
        item?.funcao_id ??
        item?.funcaoId ??
        item?.cargo_id ??
        item?.id_funcao ??
        item?.funcao?.id ??
        item?.cargo?.id ??
        0
    ),
    data_admissao:
      item?.data_admissao ?? item?.dataAdmissao ?? item?.admissao ?? null,
  };
}

export function normalizarDepartamento(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    nome: item?.nome ?? item?.Nome ?? "",
  };
}

export function normalizarFuncao(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    nome: item?.nome ?? item?.Nome ?? "",
  };
}

export function normalizarEntrega(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    idFuncionario: Number(
      item?.idFuncionario ??
        item?.funcionario_id ??
        item?.funcionarioId ??
        item?.id_funcionario ??
        item?.funcionario?.id ??
        0
    ),
    data_entrega:
      item?.data_entrega ??
      item?.dataEntrega ??
      item?.data ??
      null,
  };
}

export function normalizarDevolucao(item) {
  return {
    id: Number(item?.id ?? item?.ID ?? 0),
    idFuncionario: Number(
      item?.idFuncionario ??
        item?.funcionario_id ??
        item?.funcionarioId ??
        item?.id_funcionario ??
        item?.funcionario?.id ??
        0
    ),
    data_devolucao:
      item?.data_devolucao ??
      item?.dataDevolucao ??
      item?.data ??
      null,
  };
}