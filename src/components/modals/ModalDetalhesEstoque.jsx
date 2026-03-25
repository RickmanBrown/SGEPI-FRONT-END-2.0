import { formatarPreco, formatarValidade } from "../../utils/estoqueFormatters";

export default function ModalDetalhesEstoque({ aberto, item, onClose }) {
  if (!aberto || !item) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Detalhes do item em estoque</h3>
              <p className="text-sm text-blue-100 mt-1">
                Informações completas do lote selecionado.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 transition rounded-lg px-3 py-2 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <span className="text-[11px] uppercase tracking-wide text-gray-500 font-bold block mb-1">
              EPI
            </span>
            <strong className="text-gray-800 text-lg">{item.nome}</strong>
            <p className="text-sm text-gray-500 mt-1">
              {item.descricao || "Sem descrição."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Fabricante" valor={item.fabricante || "-"} />
            <InfoCard label="Tipo de proteção" valor={item.tipoProtecao || "-"} />
            <InfoCard label="CA" valor={item.ca || "-"} />
            <InfoCard label="Lote" valor={item.lote || "-"} />
            <InfoCard label="Tamanho" valor={item.tamanho || "-"} />
            <InfoCard label="Preço unitário" valor={formatarPreco(item.preco)} />
            <InfoCard label="Quantidade inicial" valor={item.quantidadeInicial} />
            <InfoCard label="Quantidade atual" valor={item.quantidadeAtual} />
            <InfoCard label="Alerta mínimo" valor={item.alertaMinimo} />
            <InfoCard label="Validade" valor={formatarValidade(item.validade)} />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, valor }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <span className="text-[11px] uppercase tracking-wide text-gray-500 font-bold block mb-1">
        {label}
      </span>
      <strong className="text-gray-800">{valor}</strong>
    </div>
  );
}