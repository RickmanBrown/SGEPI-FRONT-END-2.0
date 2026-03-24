export default function ModalPeriodoRelatorio({
  aberto,
  titulo,
  inicio,
  fim,
  erro,
  resumo,
  onChangeInicio,
  onChangeFim,
  onClose,
  onConfirmar,
  onLimpar,
}) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{titulo}</h3>
            <p className="text-sm text-gray-500">
              Escolha o intervalo de datas para gerar o relatório.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm text-gray-700 font-medium">
              Data inicial
              <input
                type="date"
                value={inicio}
                onChange={(e) => onChangeInicio(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-700 font-medium">
              Data final
              <input
                type="date"
                value={fim}
                onChange={(e) => onChangeFim(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              />
            </label>
          </div>

          {erro ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <span className="text-[11px] uppercase tracking-wide text-gray-500 font-bold block mb-1">
                Período selecionado
              </span>
              <strong className="text-sm text-gray-700">
                {resumo.periodoTexto}
              </strong>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <span className="text-[11px] uppercase tracking-wide text-gray-500 font-bold block mb-1">
                Devoluções encontradas
              </span>
              <strong className="text-2xl text-red-700">
                {resumo.totalDevolucoes}
              </strong>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <span className="text-[11px] uppercase tracking-wide text-gray-500 font-bold block mb-1">
                Trocas no período
              </span>
              <strong className="text-2xl text-emerald-700">
                {resumo.totalTrocas}
              </strong>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
            <button
              type="button"
              onClick={onLimpar}
              className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
            >
              Limpar datas
            </button>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={onConfirmar}
                className="px-5 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition shadow-sm"
              >
                🖨️ Gerar relatório
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}