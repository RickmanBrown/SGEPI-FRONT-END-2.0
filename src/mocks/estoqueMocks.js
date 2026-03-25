// src/mocks/estoqueMocks.js

export const mockTiposProtecao = [
  { id: 1, nome: "Proteção da Cabeça" },
  { id: 2, nome: "Proteção Auditiva" },
  { id: 3, nome: "Proteção Respiratória" },
  { id: 4, nome: "Proteção Visual" },
  { id: 5, nome: "Proteção de Mãos" },
  { id: 6, nome: "Proteção de Pés" },
  { id: 7, nome: "Proteção contra Quedas" },
];

export const mockTamanhos = [
  { id: 1, tamanho: "P" },
  { id: 2, tamanho: "M" },
  { id: 3, tamanho: "G" },
  { id: 4, tamanho: "40" },
  { id: 5, tamanho: "41" },
  { id: 6, tamanho: "42" },
];

export const mockEpis = [
  {
    id: 1,
    nome: "Bota de Segurança de Couro",
    fabricante: "Bracol",
    CA: "15432",
    descricao: "Bota ocupacional",
    validade_CA: "2027-12-31",
    idTipoProtecao: 6,
    alerta_minimo: 10,
  },
  {
    id: 2,
    nome: "Óculos de Proteção Incolor",
    fabricante: "3M",
    CA: "10346",
    descricao: "Óculos para proteção visual",
    validade_CA: "2028-06-30",
    idTipoProtecao: 4,
    alerta_minimo: 20,
  },
];

export const mockEntradas = [
  {
    id: 1,
    idEpi: 1,
    idTamanho: 6,
    data_entrada: "2026-03-01",
    quantidade: 30,
    quantidadeAtual: 18,
    data_fabricacao: "2026-01-10",
    data_validade: "2027-12-31",
    lote: "BOTA-001",
    valor_unitario: 129.9,
  },
  {
    id: 2,
    idEpi: 2,
    idTamanho: 2,
    data_entrada: "2026-03-02",
    quantidade: 100,
    quantidadeAtual: 65,
    data_fabricacao: "2026-02-01",
    data_validade: "2028-06-30",
    lote: "OCULOS-003",
    valor_unitario: 15.5,
  },
];