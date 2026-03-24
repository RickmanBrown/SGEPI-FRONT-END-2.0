import { useMemo, useState } from "react";
import { filtrarPorPeriodo, resumirDevolucoes } from "../utils/devolucoesHelpers";
import { obterTextoPeriodo } from "../utils/devolucoesFormatters";
import {
  abrirJanelaImpressao,
  gerarHtmlRelatorioDevolucoes,
} from "../utils/devolucaoRelatorio";

export function useDevolucoesRelatorio() {
  const [modalPeriodoAberto, setModalPeriodoAberto] = useState(false);
  const [tipoRelatorioModal, setTipoRelatorioModal] = useState("geral");
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [baseDoModalPeriodo, setBaseDoModalPeriodo] = useState([]);
  const [periodoRelatorioInicio, setPeriodoRelatorioInicio] = useState("");
  const [periodoRelatorioFim, setPeriodoRelatorioFim] = useState("");
  const [erroPeriodoModal, setErroPeriodoModal] = useState("");

  const registrosFiltradosModal = useMemo(() => {
    return filtrarPorPeriodo(
      baseDoModalPeriodo,
      periodoRelatorioInicio,
      periodoRelatorioFim
    );
  }, [baseDoModalPeriodo, periodoRelatorioInicio, periodoRelatorioFim]);

  const resumoModal = useMemo(() => {
    const resumo = resumirDevolucoes(registrosFiltradosModal);

    return {
      ...resumo,
      periodoTexto: obterTextoPeriodo(
        periodoRelatorioInicio,
        periodoRelatorioFim
      ),
    };
  }, [registrosFiltradosModal, periodoRelatorioInicio, periodoRelatorioFim]);

  function resetarModalPeriodo() {
    setModalPeriodoAberto(false);
    setTipoRelatorioModal("geral");
    setFuncionarioSelecionado(null);
    setBaseDoModalPeriodo([]);
    setPeriodoRelatorioInicio("");
    setPeriodoRelatorioFim("");
    setErroPeriodoModal("");
  }

  function abrirModalRelatorioGeral(registros, dataInicio = "", dataFim = "") {
    setTipoRelatorioModal("geral");
    setFuncionarioSelecionado(null);
    setBaseDoModalPeriodo(registros);
    setPeriodoRelatorioInicio(dataInicio || "");
    setPeriodoRelatorioFim(dataFim || "");
    setErroPeriodoModal("");
    setModalPeriodoAberto(true);
  }

  function abrirModalRelatorioFuncionario(funcionario, registros) {
    setTipoRelatorioModal("funcionario");
    setFuncionarioSelecionado(funcionario);
    setBaseDoModalPeriodo(registros);
    setPeriodoRelatorioInicio("");
    setPeriodoRelatorioFim("");
    setErroPeriodoModal("");
    setModalPeriodoAberto(true);
  }

  function limparDatasModal() {
    setPeriodoRelatorioInicio("");
    setPeriodoRelatorioFim("");
    setErroPeriodoModal("");
  }

  function confirmarGeracaoRelatorio() {
    if (
      periodoRelatorioInicio &&
      periodoRelatorioFim &&
      periodoRelatorioInicio > periodoRelatorioFim
    ) {
      setErroPeriodoModal("A data inicial não pode ser maior que a data final.");
      return;
    }

    if (registrosFiltradosModal.length === 0) {
      window.alert("Nenhuma devolução foi encontrada para o período selecionado.");
      return;
    }

    const html = gerarHtmlRelatorioDevolucoes({
      tipo: tipoRelatorioModal,
      funcionario: funcionarioSelecionado,
      registros: registrosFiltradosModal,
      inicio: periodoRelatorioInicio,
      fim: periodoRelatorioFim,
    });

    abrirJanelaImpressao(html);
    resetarModalPeriodo();
  }

  return {
    modalPeriodoAberto,
    tipoRelatorioModal,
    funcionarioSelecionado,
    periodoRelatorioInicio,
    periodoRelatorioFim,
    erroPeriodoModal,
    resumoModal,
    setPeriodoRelatorioInicio,
    setPeriodoRelatorioFim,
    resetarModalPeriodo,
    abrirModalRelatorioGeral,
    abrirModalRelatorioFuncionario,
    limparDatasModal,
    confirmarGeracaoRelatorio,
  };
}