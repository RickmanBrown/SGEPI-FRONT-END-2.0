export const mockFuncionarios = [
  { id: 1, nome: "João Silva", matricula: "483920" },
  { id: 2, nome: "Maria Santos", matricula: "739104" },
  { id: 3, nome: "Carlos Oliveira", matricula: "102938" },
  { id: 4, nome: "Ana Pereira", matricula: "998877" },
  { id: 5, nome: "Roberto Costa", matricula: "112233" },
  { id: 6, nome: "Fernanda Lima", matricula: "554433" },
];

export const mockEpis = [
  { id: 1, nome: "Capacete" },
  { id: 2, nome: "Luva de Raspa" },
  { id: 3, nome: "Sapato" },
];

export const mockTamanhos = [
  { id: 1, tamanho: "P" },
  { id: 2, tamanho: "M" },
  { id: 3, tamanho: "G" },
  { id: 4, tamanho: "40" },
  { id: 5, tamanho: "42" },
];

export const mockEntregasInicial = [
  {
    id: 101,
    idFuncionario: 1,
    data_entrega: "2024-01-20",
    assinatura: null,
    token_validacao: null,
  },
  {
    id: 102,
    idFuncionario: 2,
    data_entrega: "2024-02-15",
    assinatura: null,
    token_validacao: null,
  },
  {
    id: 103,
    idFuncionario: 3,
    data_entrega: "2024-03-10",
    assinatura: null,
    token_validacao: null,
  },
  {
    id: 104,
    idFuncionario: 4,
    data_entrega: "2024-03-12",
    assinatura: null,
    token_validacao: null,
  },
  {
    id: 105,
    idFuncionario: 5,
    data_entrega: "2024-03-15",
    assinatura: null,
    token_validacao: null,
  },
  {
    id: 106,
    idFuncionario: 1,
    data_entrega: "2024-03-18",
    assinatura: null,
    token_validacao: null,
  },
];

export const mockItensEntreguesInicial = [
  { id: "a1", idEntrega: 101, idEpi: 1, idTamanho: 2, quantidade: 1 },
  { id: "a2", idEntrega: 102, idEpi: 2, idTamanho: 1, quantidade: 5 },
  { id: "a3", idEntrega: 103, idEpi: 3, idTamanho: 5, quantidade: 1 },
  { id: "a4", idEntrega: 104, idEpi: 1, idTamanho: 1, quantidade: 1 },
  { id: "a5", idEntrega: 105, idEpi: 3, idTamanho: 4, quantidade: 1 },
  { id: "a6", idEntrega: 106, idEpi: 2, idTamanho: 3, quantidade: 2 },
];