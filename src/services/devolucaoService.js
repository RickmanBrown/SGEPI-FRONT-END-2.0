import { api } from "./api";

import {
  mockFuncionarios,
  mockEpis,
  mockTamanhos,
  mockMotivos,
  mockDevolucoesInicial,
} from "../mocks/devolucoesMocks";

import {
  extrairLista,
  normalizarFuncionario,
  normalizarEpi,
  normalizarTamanho,
  normalizarMotivo,
  normalizarDevolucao,
} from "../utils/devolucoesNormalizers";

export async function buscarPrimeiraLista(rotas, fallback = []) {
  for (const rota of rotas) {
    try {
      const resp = await api.get(rota);
      const lista = extrairLista(resp, fallback);

      if (Array.isArray(lista)) {
        return lista;
      }
    } catch (erro) {
      // tenta a próxima rota
    }
  }

  return fallback;
}

export async function carregarDadosDevolucoes() {
  const [
    listaFuncionarios,
    listaEpis,
    listaTamanhos,
    listaMotivos,
    listaDevolucoes,
  ] = await Promise.all([
    buscarPrimeiraLista(["/funcionarios"], mockFuncionarios),
    buscarPrimeiraLista(["/epis", "/epi", "/produtos"], mockEpis),
    buscarPrimeiraLista(["/tamanhos", "/tamanho"], mockTamanhos),
    buscarPrimeiraLista(
      [
        "/motivos-devolucao",
        "/motivo-devolucao",
        "/motivos_baixa",
        "/motivos",
      ],
      mockMotivos
    ),
    buscarPrimeiraLista(
      ["/devolucoes", "/devolucao", "/baixas"],
      mockDevolucoesInicial
    ),
  ]);

  return {
    funcionarios: listaFuncionarios.map(normalizarFuncionario),
    epis: listaEpis.map(normalizarEpi),
    tamanhos: listaTamanhos.map(normalizarTamanho),
    motivos: listaMotivos.map(normalizarMotivo),
    devolucoes: listaDevolucoes.map(normalizarDevolucao),
  };
}

export function obterDadosMockDevolucoes() {
  return {
    funcionarios: mockFuncionarios.map(normalizarFuncionario),
    epis: mockEpis.map(normalizarEpi),
    tamanhos: mockTamanhos.map(normalizarTamanho),
    motivos: mockMotivos.map(normalizarMotivo),
    devolucoes: mockDevolucoesInicial.map(normalizarDevolucao),
  };
}