export const mockFornecedores = [
  {
    id: 1,
    razao_social: "3M do Brasil Ltda",
    nome_fantasia: "3M",
    cnpj: "45.985.371/0001-08",
    inscricao_estadual: "123.456.789.000",
  },
  {
    id: 2,
    razao_social: "Bracol Calçados de Segurança Ltda",
    nome_fantasia: "Bracol",
    cnpj: "12.345.678/0001-90",
    inscricao_estadual: "987.654.321.000",
  },
];

export const mockEpis = [
  { id: 1, nome: "Capacete de Segurança", fabricante: "3M", CA: "12345" },
  { id: 2, nome: "Luva de Proteção", fabricante: "Volk", CA: "67890" },
  { id: 3, nome: "Sapato de Segurança", fabricante: "Bracol", CA: "54321" },
  { id: 4, nome: "Óculos de Proteção", fabricante: "3M", CA: "99999" },
];

export const mockTamanhos = [
  { id: 1, tamanho: "P" },
  { id: 2, tamanho: "M" },
  { id: 3, tamanho: "G" },
  { id: 4, tamanho: "GG" },
  { id: 5, tamanho: "38" },
  { id: 6, tamanho: "40" },
  { id: 7, tamanho: "42" },
  { id: 8, tamanho: "44" },
  { id: 9, tamanho: "Único" },
];

export const mockEntradasInicial = [
  {
    id: 101,
    idEpi: 1,
    idTamanho: 2,
    idFornecedor: 1,
    data_entrada: "2024-01-15",
    quantidade: 50,
    quantidadeAtual: 50,
    data_fabricacao: "2023-12-01",
    data_validade: "2026-12-01",
    lote: "L-2024-A",
    valor_unitario: 45.9,
    nota_fiscal_numero: "12345",
    nota_fiscal_serie: "1",
  },
  {
    id: 102,
    idEpi: 3,
    idTamanho: 7,
    idFornecedor: 2,
    data_entrada: "2024-01-18",
    quantidade: 20,
    quantidadeAtual: 20,
    data_fabricacao: "2023-11-15",
    data_validade: "2026-11-15",
    lote: "L-998-B",
    valor_unitario: 120,
    nota_fiscal_numero: "45678",
    nota_fiscal_serie: "2",
  },
  {
    id: 103,
    idEpi: 2,
    idTamanho: 3,
    idFornecedor: 1,
    data_entrada: "2024-02-01",
    quantidade: 100,
    quantidadeAtual: 100,
    data_fabricacao: "2024-01-05",
    data_validade: "2027-01-05",
    lote: "L-555-C",
    valor_unitario: 12.5,
    nota_fiscal_numero: "78910",
    nota_fiscal_serie: "1",
  },
];