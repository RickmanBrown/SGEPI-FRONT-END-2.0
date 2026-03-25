import { useState } from "react";
import { hojeIso } from "../utils/entradasFormatters";

export function useEntradasForm() {
  const [modalAberto, setModalAberto] = useState(false);
  const [idFornecedor, setIdFornecedor] = useState("");
  const [idEpi, setIdEpi] = useState("");
  const [idTamanho, setIdTamanho] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataFabricacao, setDataFabricacao] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [lote, setLote] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [notaFiscalNumero, setNotaFiscalNumero] = useState("");
  const [notaFiscalSerie, setNotaFiscalSerie] = useState("");
  const [carregando, setCarregando] = useState(false);

  function resetarFormulario() {
    setIdFornecedor("");
    setIdEpi("");
    setIdTamanho("");
    setQuantidade("");
    setDataEntrada(hojeIso());
    setDataFabricacao("");
    setDataValidade("");
    setLote("");
    setValorUnitario("");
    setNotaFiscalNumero("");
    setNotaFiscalSerie("");
  }

  function abrirModal() {
    resetarFormulario();
    setModalAberto(true);
  }

  function fecharModal() {
    if (carregando) return;
    setModalAberto(false);
  }

  return {
    modalAberto,
    setModalAberto,
    idFornecedor,
    setIdFornecedor,
    idEpi,
    setIdEpi,
    idTamanho,
    setIdTamanho,
    quantidade,
    setQuantidade,
    dataEntrada,
    setDataEntrada,
    dataFabricacao,
    setDataFabricacao,
    dataValidade,
    setDataValidade,
    lote,
    setLote,
    valorUnitario,
    setValorUnitario,
    notaFiscalNumero,
    setNotaFiscalNumero,
    notaFiscalSerie,
    setNotaFiscalSerie,
    carregando,
    setCarregando,
    resetarFormulario,
    abrirModal,
    fecharModal,
  };
}