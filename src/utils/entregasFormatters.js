function pad2(valor) {
  return String(valor).padStart(2, "0");
}

function dataLocalParaISO(data) {
  if (!data) return "";
  return `${data.getFullYear()}-${pad2(data.getMonth() + 1)}-${pad2(
    data.getDate()
  )}`;
}

export function obterHojeISO() {
  return dataLocalParaISO(new Date());
}

export function obterPrimeiroDiaMesISO() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${pad2(hoje.getMonth() + 1)}-01`;
}

export function obterPrimeiroDiaAnoISO() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-01-01`;
}

export function obterDataMenosDiasISO(dias) {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return dataLocalParaISO(data);
}

export function formatarDataBR(data) {
  if (!data) return "--";

  const texto = String(data).substring(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const [ano, mes, dia] = texto.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const dataObj = new Date(data);
  if (Number.isNaN(dataObj.getTime())) return "--";

  return dataObj.toLocaleDateString("pt-BR");
}

export function obterTextoPeriodo(inicio, fim) {
  if (inicio && fim) return `${formatarDataBR(inicio)} até ${formatarDataBR(fim)}`;
  if (inicio && !fim) return `A partir de ${formatarDataBR(inicio)}`;
  if (!inicio && fim) return `Até ${formatarDataBR(fim)}`;
  return "Período completo (todos os registros)";
}

export function escapeHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}