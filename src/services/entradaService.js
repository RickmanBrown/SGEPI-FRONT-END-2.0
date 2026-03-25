import { api } from "./api";
import {
  mockFornecedores,
  mockEpis,
  mockTamanhos,
  mockEntradasInicial,
} from "../mocks/entradasMocks";
import {
  extrairLista,
  normalizarFornecedor,
  normalizarEpi,
  normalizarTamanho,
  normalizarEntrada,
} from "../utils/entradasNormalizers";

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

export async function carregarDadosEntradas() {
  const [listaFornecedores, listaEpis, listaTamanhos, listaEntradas] =
    await Promise.all([
      buscarPrimeiraLista(["/fornecedores"], mockFornecedores),
      buscarPrimeiraLista(["/epis", "/epi", "/produtos"], mockEpis),
      buscarPrimeiraLista(["/tamanhos", "/tamanho"], mockTamanhos),
      buscarPrimeiraLista(
        ["/entrada-epi", "/entrada_epi", "/entradas"],
        mockEntradasInicial
      ),
    ]);

  return {
    fornecedores: listaFornecedores.map(normalizarFornecedor),
    epis: listaEpis.map(normalizarEpi),
    tamanhos: listaTamanhos.map(normalizarTamanho),
    entradas: listaEntradas.map(normalizarEntrada),
  };
}

export function obterDadosMockEntradas() {
  return {
    fornecedores: mockFornecedores.map(normalizarFornecedor),
    epis: mockEpis.map(normalizarEpi),
    tamanhos: mockTamanhos.map(normalizarTamanho),
    entradas: mockEntradasInicial.map(normalizarEntrada),
  };
}

export async function salvarEntradaNoServidor(pacoteDados) {
  const rotas = ["/entrada-epi", "/entrada_epi", "/entradas"];

  for (const rota of rotas) {
    try {
      await api.post(rota, pacoteDados);
      return true;
    } catch {
      // tenta próxima rota
    }
  }

  return false;
}