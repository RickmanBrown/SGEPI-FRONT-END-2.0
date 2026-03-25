import { api } from "./api";
import {
  mockFuncionarios,
  mockEpis,
  mockTamanhos,
  mockEntregasInicial,
  mockItensEntreguesInicial,
} from "../mocks/entregasMocks";
import {
  extrairLista,
  normalizarFuncionario,
  normalizarEpi,
  normalizarTamanho,
  normalizarEntrega,
  normalizarItemEntregue,
} from "../utils/entregasNormalizers";

export async function buscarPrimeiraLista(rotas, fallback = []) {
  for (const rota of rotas) {
    try {
      const resp = await api.get(rota);
      const lista = extrairLista(resp, fallback);
      if (Array.isArray(lista)) return lista;
    } catch {
      // tenta a próxima rota
    }
  }
  return fallback;
}

export async function carregarDadosEntregas() {
  const [
    listaFuncionarios,
    listaEpis,
    listaTamanhos,
    listaEntregas,
    listaItensEntregues,
  ] = await Promise.all([
    buscarPrimeiraLista(["/funcionarios"], mockFuncionarios),
    buscarPrimeiraLista(["/epis", "/epi", "/produtos"], mockEpis),
    buscarPrimeiraLista(["/tamanhos", "/tamanho"], mockTamanhos),
    buscarPrimeiraLista(
      ["/entregas", "/entrega-epi", "/entrega_epi"],
      mockEntregasInicial
    ),
    buscarPrimeiraLista(
      ["/epis-entregues", "/epis_entregues"],
      mockItensEntreguesInicial
    ),
  ]);

  return {
    funcionarios: listaFuncionarios.map(normalizarFuncionario),
    epis: listaEpis.map(normalizarEpi),
    tamanhos: listaTamanhos.map(normalizarTamanho),
    entregas: listaEntregas.map(normalizarEntrega),
    itensEntregues: listaItensEntregues.map(normalizarItemEntregue),
  };
}

export function obterDadosMockEntregas() {
  return {
    funcionarios: mockFuncionarios.map(normalizarFuncionario),
    epis: mockEpis.map(normalizarEpi),
    tamanhos: mockTamanhos.map(normalizarTamanho),
    entregas: mockEntregasInicial.map(normalizarEntrega),
    itensEntregues: mockItensEntreguesInicial.map(normalizarItemEntregue),
  };
}