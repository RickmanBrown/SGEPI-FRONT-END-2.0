export const mockFuncionarios = [
  {
    id: 1,
    nome: "João Silva",
    matricula: "483920",
    idDepartamento: 1,
    idFuncao: 1,
    data_admissao: "2023-01-10",
  },
  {
    id: 2,
    nome: "Maria Santos",
    matricula: "739104",
    idDepartamento: 2,
    idFuncao: 2,
    data_admissao: "2022-08-15",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    matricula: "102938",
    idDepartamento: 1,
    idFuncao: 3,
    data_admissao: "2021-05-03",
  },
  {
    id: 4,
    nome: "Ana Pereira",
    matricula: "554433",
    idDepartamento: 3,
    idFuncao: 2,
    data_admissao: "2024-01-20",
  },
];

export const mockDepartamentos = [
  { id: 1, nome: "Produção" },
  { id: 2, nome: "Almoxarifado" },
  { id: 3, nome: "Administrativo" },
];

export const mockFuncoes = [
  { id: 1, nome: "Operador" },
  { id: 2, nome: "Assistente" },
  { id: 3, nome: "Técnico de Segurança" },
];

export const mockEntregas = [
  {
    id: 101,
    idFuncionario: 1,
    data_entrega: "2024-01-20",
  },
  {
    id: 102,
    idFuncionario: 2,
    data_entrega: "2024-02-11",
  },
  {
    id: 103,
    idFuncionario: 1,
    data_entrega: "2024-03-05",
  },
];

export const mockDevolucoes = [
  {
    id: 201,
    idFuncionario: 1,
    data_devolucao: "2024-03-12",
  },
  {
    id: 202,
    idFuncionario: 3,
    data_devolucao: "2024-02-22",
  },
];