export function formatarValidade(dataString) {
  if (!dataString) return "--";

  const data = new Date(dataString);
  if (Number.isNaN(data.getTime())) return "--";

  return data.toLocaleDateString("pt-BR");
}

export function formatarPreco(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}