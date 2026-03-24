import {
  formatarData,
  obterTextoPeriodo,
  escapeHtml,
} from "./devolucoesFormatters";

export function abrirJanelaImpressao(html) {
  const janela = window.open("", "_blank", "width=1200,height=800");

  if (!janela) {
    window.alert(
      "Não foi possível abrir a janela de impressão. Verifique se o navegador bloqueou pop-ups."
    );
    return;
  }

  janela.document.open();
  janela.document.write(html);
  janela.document.close();
}

export function gerarHtmlRelatorioDevolucoes({
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

  const totalDevolucoes = registros.length;
  const totalTrocas = registros.filter((item) => item.houveTroca).length;
  const totalSemTroca = totalDevolucoes - totalTrocas;

  const tituloPrincipal =
    tipo === "funcionario"
      ? "Histórico Individual de Devoluções"
      : "Relatório Geral de Devoluções de EPI";

  const subtituloPrincipal =
    tipo === "funcionario"
      ? `${funcionario?.nome || "Funcionário não identificado"} • Matrícula ${
          funcionario?.matricula || "--"
        }`
      : "Todos os funcionários";

  const linhasTabela =
    registros.length > 0
      ? registros
          .map((d) => {
            const funcionarioNome = escapeHtml(
              d.funcionarioNome || "Não identificado"
            );
            const matricula = escapeHtml(d.funcionarioMatricula || "--");
            const epiNome = escapeHtml(d.epiNome || "EPI não identificado");
            const tamanhoNome = escapeHtml(d.tamanhoNome || "-");
            const motivoNome = escapeHtml(
              d.motivoNome || "Motivo não identificado"
            );
            const quantidade = Number(d.quantidadeADevolver || 0);

            const trocaHtml = d.houveTroca
              ? `<div class="troca-box">
                  <span class="tag tag-ok">Houve troca</span>
                  <div class="troca-detalhe">
                    Novo item: <strong>${escapeHtml(
                      d.epiNovoNome || "EPI de troca"
                    )}</strong> (${escapeHtml(
                  d.tamanhoNovoNome || "-"
                )}) • Quantidade: <strong>${Number(d.quantidadeNova || 0)}</strong>
                  </div>
                </div>`
              : `<span class="tag tag-muted">Sem troca</span>`;

            const assinaturaHtml =
              d.assinatura_digital || d.token_validacao
                ? `<span class="tag tag-ok">Registrada digitalmente</span>`
                : `<div class="assinatura-vazia"></div><span class="assinatura-legenda">Assinatura física</span>`;

            return `
              <tr>
                <td class="col-data">${formatarData(d.data_devolucao)}</td>
                <td class="col-funcionario">
                  <div class="funcionario-nome">${funcionarioNome}</div>
                  <div class="funcionario-meta">Matrícula: ${matricula}</div>
                </td>
                <td class="col-item">
                  <div class="item-principal">${epiNome} (${tamanhoNome})</div>
                  <div class="item-sub">Quantidade devolvida: <strong>${quantidade}</strong></div>
                </td>
                <td class="col-motivo">${motivoNome}</td>
                <td class="col-troca">${trocaHtml}</td>
                <td class="col-assinatura">${assinaturaHtml}</td>
              </tr>
            `;
          })
          .join("")
      : `
        <tr>
          <td colspan="6" style="text-align:center; padding: 28px; color: #6b7280;">
            Nenhum registro encontrado para o período selecionado.
          </td>
        </tr>
      `;

  return `
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>${tituloPrincipal}</title>
        <style>
          * {
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
          }

          body {
            margin: 0;
            padding: 32px;
            color: #1f2937;
            background: #ffffff;
          }

          .header {
            border-bottom: 3px solid #b91c1c;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }

          .titulo {
            margin: 0;
            font-size: 28px;
            color: #991b1b;
          }

          .subtitulo {
            margin: 8px 0 0;
            font-size: 14px;
            color: #4b5563;
          }

          .meta {
            margin-top: 14px;
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            font-size: 12px;
            color: #6b7280;
          }

          .cards {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin: 24px 0;
          }

          .card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 14px;
            background: #f9fafb;
          }

          .card-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #6b7280;
            margin-bottom: 8px;
            font-weight: bold;
          }

          .card-value {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            background: #f3f4f6;
          }

          th,
          td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            vertical-align: top;
            text-align: left;
            font-size: 13px;
          }

          th {
            font-size: 12px;
            text-transform: uppercase;
            color: #374151;
          }

          .funcionario-nome,
          .item-principal {
            font-weight: bold;
            color: #111827;
            margin-bottom: 4px;
          }

          .funcionario-meta,
          .item-sub,
          .assinatura-legenda,
          .troca-detalhe {
            color: #6b7280;
            font-size: 12px;
            line-height: 1.5;
          }

          .tag {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: bold;
          }

          .tag-ok {
            background: #dcfce7;
            color: #166534;
          }

          .tag-muted {
            background: #f3f4f6;
            color: #4b5563;
          }

          .troca-box {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .assinatura-vazia {
            width: 100%;
            height: 42px;
            border-bottom: 1px solid #9ca3af;
            margin-bottom: 6px;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-top: 36px;
          }

          .assinatura-box {
            flex: 1;
            border-top: 1px solid #6b7280;
            padding-top: 8px;
            text-align: center;
            font-size: 12px;
            color: #374151;
          }

          .obs {
            margin-top: 18px;
            font-size: 11px;
            color: #6b7280;
            line-height: 1.6;
          }

          @media print {
            body {
              padding: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="titulo">${tituloPrincipal}</h1>
          <p class="subtitulo">${escapeHtml(subtituloPrincipal)}</p>

          <div class="meta">
            <div><strong>Período:</strong> ${escapeHtml(periodoTexto)}</div>
            <div><strong>Emitido em:</strong> ${dataEmissao}</div>
            <div><strong>Hora:</strong> ${horaEmissao}</div>
          </div>
        </div>

        <div class="cards">
          <div class="card">
            <div class="card-label">Total de devoluções</div>
            <div class="card-value">${totalDevolucoes}</div>
          </div>

          <div class="card">
            <div class="card-label">Com troca</div>
            <div class="card-value">${totalTrocas}</div>
          </div>

          <div class="card">
            <div class="card-label">Sem troca</div>
            <div class="card-value">${totalSemTroca}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Funcionário</th>
              <th>Item Devolvido</th>
              <th>Motivo</th>
              <th>Troca</th>
              <th>Assinatura</th>
            </tr>
          </thead>
          <tbody>
            ${linhasTabela}
          </tbody>
        </table>

        <div class="footer">
          <div class="assinatura-box">
            Responsável pelo Almoxarifado
          </div>
          <div class="assinatura-box">
            Técnico de Segurança do Trabalho
          </div>
        </div>

        <div class="obs">
          Declaro, para os devidos fins, que o presente relatório representa o histórico de devoluções e trocas de EPIs conforme os registros lançados no sistema. Recomenda-se a conferência periódica dos dados e das assinaturas em conformidade com a NR-06 e com as rotinas internas da empresa.
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