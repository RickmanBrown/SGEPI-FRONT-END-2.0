import { api } from "./api";
import {
  mockTiposProtecao,
  mockTamanhos,
  mockEpis,
  mockEntradas,
} from "../mocks/estoqueMocks";
import {
  extrairLista,
  normalizarTipoProtecao,
  normalizarTamanho,
  normalizarEpi,
  normalizarEntrada,
} from "../utils/estoqueNormalizers";

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

export async function carregarDadosEstoque() {
  const [listaTipos, listaTamanhos, listaEpis, listaEntradas] =
    await Promise.all([
      buscarPrimeiraLista(
        ["/tipo-protecao", "/tipos-protecao", "/tipos_protecao"],
        mockTiposProtecao
      ),
      buscarPrimeiraLista(["/tamanhos", "/tamanho"], mockTamanhos),
      buscarPrimeiraLista(["/epis", "/epi", "/produtos"], mockEpis),
      buscarPrimeiraLista(
        ["/entrada-epi", "/entrada_epi", "/entradas-epi", "/entradas_epis", "/entradas"],
        mockEntradas
      ),
    ]);

  return {
    tiposProtecao: listaTipos.map(normalizarTipoProtecao),
    tamanhos: listaTamanhos.map(normalizarTamanho),
    epis: listaEpis.map(normalizarEpi),
    entradas: listaEntradas.map(normalizarEntrada),
  };
}

export function obterDadosMockEstoque() {
  return {
    tiposProtecao: mockTiposProtecao.map(normalizarTipoProtecao),
    tamanhos: mockTamanhos.map(normalizarTamanho),
    epis: mockEpis.map(normalizarEpi),
    entradas: mockEntradas.map(normalizarEntrada),
  };
}