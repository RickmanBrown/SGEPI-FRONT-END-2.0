export default function ModalEntrada({
  aberto,
  onClose,
  onSalvar,
  carregando,
  epis,
  tamanhos,
  fornecedores,
  idEpi,
  setIdEpi,
  idTamanho,
  setIdTamanho,
  quantidade,
  setQuantidade,
  dataEntrada,
  setDataEntrada,
  valorUnitario,
  setValorUnitario,
  idFornecedor,
  setIdFornecedor,
  lote,
  setLote,
  dataFabricacao,
  setDataFabricacao,
  dataValidade,
  setDataValidade,
  notaFiscalNumero,
  setNotaFiscalNumero,
  notaFiscalSerie,
  setNotaFiscalSerie,
}) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-gray-800">📦 Nova Entrada</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecione o EPI <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={idEpi}
              onChange={(e) => setIdEpi(e.target.value)}
            >
              <option value="">Selecione...</option>
              {epis.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamanho <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={idTamanho}
              onChange={(e) => setIdTamanho(e.target.value)}
            >
              <option value="">Selecione...</option>
              {tamanhos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tamanho}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ex: 50"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da Entrada <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={dataEntrada}
              onChange={(e) => setDataEntrada(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Unitário (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="0.00"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fornecedor <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={idFornecedor}
              onChange={(e) => setIdFornecedor(e.target.value)}
            >
              <option value="">Selecione...</option>
              {fornecedores.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome_fantasia || item.razao_social}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número do Lote
            </label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ex: LT-2024"
              value={lote}
              onChange={(e) => setLote(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Fabricação
            </label>
            <input
              type="date"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={dataFabricacao}
              onChange={(e) => setDataFabricacao(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Validade
            </label>
            <input
              type="date"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={dataValidade}
              onChange={(e) => setDataValidade(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número da Nota Fiscal
            </label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ex: 12345"
              value={notaFiscalNumero}
              onChange={(e) => setNotaFiscalNumero(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Série da Nota Fiscal
            </label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ex: 1"
              value={notaFiscalSerie}
              onChange={(e) => setNotaFiscalSerie(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
          <button
            onClick={onClose}
            disabled={carregando}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            onClick={onSalvar}
            disabled={carregando}
            className={`px-4 py-2 text-white font-bold rounded-lg shadow-md transition ${
              carregando
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {carregando ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}