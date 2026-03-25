import { api } from "./api";
import {
  mockFuncionarios,
  mockDepartamentos,
  mockFuncoes,
  mockEntregas,
  mockDevolucoes,
} from "../mocks/funcionariosMocks";
import {
  extrairLista,
  normalizarFuncionario,
  normalizarDepartamento,
  normalizarFuncao,
  normalizarEntrega,
  normalizarDevolucao,
} from "../utils/funcionariosNormalizers";

export async function buscarPrimeiraLista(rotas, fallback = []) {
  for (const rota of rotas) {
    try {
      const resp = await api.get(rota);
      const lista = extrairLista(resp, fallback);
      if (Array.isArray(lista)) return lista;
    } catch {
      // tenta próxima rota
    }
  }
  return fallback;
}

export async function carregarDadosFuncionarios() {
  const [
    listaFuncionarios,
    listaDepartamentos,
    listaFuncoes,
    listaEntregas,
    listaDevolucoes,
  ] = await Promise.all([
    buscarPrimeiraLista(["/funcionarios"], mockFuncionarios),
    buscarPrimeiraLista(["/departamentos"], mockDepartamentos),
    buscarPrimeiraLista(["/funcoes", "/cargos"], mockFuncoes),
    buscarPrimeiraLista(
      ["/entrega-epi", "/entrega_epi", "/entregas"],
      mockEntregas
    ),
    buscarPrimeiraLista(["/devolucao", "/devolucoes"], mockDevolucoes),
  ]);

  return {
    funcionarios: listaFuncionarios.map(normalizarFuncionario),
    departamentos: listaDepartamentos.map(normalizarDepartamento),
    funcoes: listaFuncoes.map(normalizarFuncao),
    entregas: listaEntregas.map(normalizarEntrega),
    devolucoes: listaDevolucoes.map(normalizarDevolucao),
  };
}

export function obterDadosMockFuncionarios() {
  return {
    funcionarios: mockFuncionarios.map(normalizarFuncionario),
    departamentos: mockDepartamentos.map(normalizarDepartamento),
    funcoes: mockFuncoes.map(normalizarFuncao),
    entregas: mockEntregas.map(normalizarEntrega),
    devolucoes: mockDevolucoes.map(normalizarDevolucao),
  };
}