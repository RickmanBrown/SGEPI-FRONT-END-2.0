import {
  formatarDataBR,
  obterTextoPeriodo,
  escapeHtml,
} from "./entregasFormatters";
import { totalItensDaLista, totalTiposDaLista } from "./entregasHelpers";

export function abrirJanelaImpressao(html) {
  const win = window.open("", "", "width=1100,height=750");

  if (!win) {
    window.alert(
      "Não foi possível abrir a janela de impressão. Verifique o bloqueador de pop-up."
    );
    return;
  }

  win.document.write(html);
  win.document.close();
}

export function gerarHtmlRelatorioEntregas({
  tipo = "geral",
  funcionario = null,
  registros = [],
  inicio = "",
  fim = "",
}) {
  const periodoTexto = obterTextoPeriodo(inicio, fim);
  const dataEmissao = new Date().toLocaleDateString("pt-BR");
  const horaEmissao = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalEntregas = registros.length;
  const totalItens = totalItensDaLista(registros);
  const totalTipos = totalTiposDaLista(registros);

  const tituloPrincipal =
    tipo === "funcionario"
      ? "Histórico Individual de Entregas de EPIs"
      : "Relatório Geral de Distribuição de EPIs";

  const subtituloPrincipal =
    tipo === "funcionario"
      ? `${funcionario?.nome || "Funcionário não identificado"} • Matrícula ${
          funcionario?.matricula || "--"
        }`
      : "Todos os funcionários";

  const linhasTabela =
    registros.length > 0
      ? registros
          .map((ent) => {
            const funcionarioNome = escapeHtml(
              ent.funcionario?.nome || "Não identificado"
            );
            const matricula = escapeHtml(ent.funcionario?.matricula || "--");

            const itensHtml =
              ent.itens?.length > 0
                ? ent.itens
                    .map((item) => {
                      const epi = escapeHtml(item.epiNome || "EPI");
                      const tamanho = escapeHtml(item.tamanho || "-");
                      const quantidade = Number(item.quantidade || 0);

                      return `<span class="item-tag">${epi} (${tamanho}) <strong>x${quantidade}</strong></span>`;
                    })
                    .join(" ")
                : `<span class="sem-itens">Sem itens vinculados</span>`;

            const assinaturaHtml =
              ent.assinatura || ent.tokenValidacao
                ? `<span class="tag tag-ok">Registrada digitalmente</span>`
                : `<div class="assinatura-vazia"></div><span class="assinatura-legenda">Assinatura física</span>`;

            return `
              <tr>
                <td class="col-data">${formatarDataBR(ent.dataEntrega)}</td>
                <td class="col-funcionario">
                  <div class="funcionario-nome">${funcionarioNome}</div>
                  <div class="funcionario-meta">Matrícula: ${matricula}</div>
                </td>
                <td class="col-itens">${itensHtml}</td>
                <td class="col-assinatura">${assinaturaHtml}</td>
              </tr>
            `;
          })
          .join("")
      : `
        <tr>
          <td colspan="4" class="sem-registros">
            Nenhum registro encontrado para o período selecionado.
          </td>
        </tr>
      `;

  return `
    <html>
      <head>
        <title>${escapeHtml(tituloPrincipal)}</title>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 32px;
            color: #1f2937;
            background: #ffffff;
          }
          .topbar {
            border: 1px solid #dbeafe;
            background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
            border-radius: 18px;
            padding: 22px 24px;
            margin-bottom: 24px;
          }
          .topbar-grid {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
          }
          .topbar h1 {
            margin: 0;
            font-size: 24px;
            color: #1d4ed8;
            font-weight: 800;
          }
          .topbar p {
            margin: 8px 0 0;
            color: #475569;
            font-size: 13px;
          }
          .meta-box {
            min-width: 260px;
            border: 1px solid #dbeafe;
            background: #ffffff;
            border-radius: 14px;
            padding: 14px 16px;
          }
          .meta-row {
            font-size: 12px;
            color: #334155;
            line-height: 1.6;
            margin-bottom: 2px;
          }
          .cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .card {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 16px;
            background: #f8fafc;
          }
          .label {
            display: block;
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 6px;
          }
          .value {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }
          thead th {
            text-align: left;
            padding: 12px 14px;
            background: #0f172a;
            color: #ffffff;
            font-size: 11px;
            text-transform: uppercase;
          }
          tbody td {
            padding: 14px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
            font-size: 12px;
          }
          tbody tr:nth-child(even) {
            background: #fafafa;
          }
          .funcionario-nome {
            font-size: 13px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 4px;
          }
          .funcionario-meta {
            font-size: 11px;
            color: #6b7280;
          }
          .item-tag {
            display: inline-block;
            padding: 5px 8px;
            margin: 2px;
            border-radius: 999px;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            font-size: 11px;
            font-weight: 500;
          }
          .tag {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
          }
          .tag-ok {
            color: #166534;
            background: #dcfce7;
            border: 1px solid #bbf7d0;
          }
          .assinatura-vazia {
            width: 80%;
            margin: 10px auto 6px;
            border-bottom: 1px solid #94a3b8;
            min-height: 20px;
          }
          .assinatura-legenda {
            font-size: 10px;
            color: #6b7280;
            font-style: italic;
          }
          .sem-itens, .sem-registros {
            color: #6b7280;
            font-style: italic;
          }
          .footer {
            margin-top: 28px;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          .assinatura-box {
            width: 48%;
            padding-top: 42px;
            border-top: 1px solid #334155;
            text-align: center;
            font-size: 11px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="topbar">
          <div class="topbar-grid">
            <div>
              <h1>${escapeHtml(tituloPrincipal)}</h1>
              <p>${escapeHtml(subtituloPrincipal)}</p>
            </div>
            <div class="meta-box">
              <div class="meta-row"><strong>Período:</strong> ${escapeHtml(periodoTexto)}</div>
              <div class="meta-row"><strong>Emissão:</strong> ${escapeHtml(dataEmissao)}</div>
              <div class="meta-row"><strong>Hora:</strong> ${escapeHtml(horaEmissao)}</div>
            </div>
          </div>
        </div>

        <div class="cards">
          <div class="card">
            <span class="label">Entregas</span>
            <span class="value">${totalEntregas}</span>
          </div>
          <div class="card">
            <span class="label">Itens distribuídos</span>
            <span class="value">${totalItens}</span>
          </div>
          <div class="card">
            <span class="label">Tipos de item</span>
            <span class="value">${totalTipos}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Colaborador</th>
              <th>Itens entregues</th>
              <th>Assinatura</th>
            </tr>
          </thead>
          <tbody>
            ${linhasTabela}
          </tbody>
        </table>

        <div class="footer">
          <div class="assinatura-box">Responsável pela Entrega</div>
          <div class="assinatura-box">Técnico de Segurança / Conferência</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
}