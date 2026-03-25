import { useMemo, useState } from "react";
import { filtrarEntregasPorPeriodo, totalItensDaLista } from "../utils/entregasHelpers";
import {
  abrirJanelaImpressao,
  gerarHtmlRelatorioEntregas,
} from "../utils/entregaRelatorio";

export function useEntregasRelatorio(entregasResolvidas, dataInicio = "", dataFim = "") {
  const [modalPeriodoAberto, setModalPeriodoAberto] = useState(false);
  const [tipoRelatorioModal, setTipoRelatorioModal] = useState("geral");
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [periodoRelatorioInicio, setPeriodoRelatorioInicio] = useState("");
  const [periodoRelatorioFim, setPeriodoRelatorioFim] = useState("");
  const [erroPeriodoModal, setErroPeriodoModal] = useState("");

  const baseDoModalPeriodo = useMemo(() => {
    if (tipoRelatorioModal === "funcionario" && funcionarioSelecionado) {
      return entregasResolvidas
        .filter(
          (entrega) =>
            Number(entrega.idFuncionario) === Number(funcionarioSelecionado.id)
        )
        .sort((a, b) => {
          if (a.dataEntrega > b.dataEntrega) return -1;
          if (a.dataEntrega < b.dataEntrega) return 1;
          return 0;
        });
    }

    return [...entregasResolvidas].sort((a, b) => {
      if (a.dataEntrega > b.dataEntrega) return -1;
      if (a.dataEntrega < b.dataEntrega) return 1;
      return 0;
    });
  }, [tipoRelatorioModal, funcionarioSelecionado, entregasResolvidas]);

  const resumoModalPeriodo = useMemo(() => {
    const lista = filtrarEntregasPorPeriodo(
      baseDoModalPeriodo,
      periodoRelatorioInicio,
      periodoRelatorioFim
    );

    return {
      totalEntregas: lista.length,
      totalItens: totalItensDaLista(lista),
    };
  }, [baseDoModalPeriodo, periodoRelatorioInicio, periodoRelatorioFim]);

  function resetarModalPeriodo() {
    setModalPeriodoAberto(false);
    setTipoRelatorioModal("geral");
    setFuncionarioSelecionado(null);
    setPeriodoRelatorioInicio("");
    setPeriodoRelatorioFim("");
    setErroPeriodoModal("");
  }

  function abrirModalRelatorioGeral() {
    setTipoRelatorioModal("geral");
    setFuncionarioSelecionado(null);
    setPeriodoRelatorioInicio(dataInicio || "");
    setPeriodoRelatorioFim(dataFim || "");
    setErroPeriodoModal("");
    setModalPeriodoAberto(true);
  }

  function abrirModalRelatorioFuncionario(funcionario) {
    if (!funcionario) return;
    setTipoRelatorioModal("funcionario");
    setFuncionarioSelecionado(funcionario);
    setPeriodoRelatorioInicio(dataInicio || "");
    setPeriodoRelatorioFim(dataFim || "");
    setErroPeriodoModal("");
    setModalPeriodoAberto(true);
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

    const filtradas = filtrarEntregasPorPeriodo(
      [...baseDoModalPeriodo],
      periodoRelatorioInicio,
      periodoRelatorioFim
    );

    if (filtradas.length === 0) {
      window.alert("Nenhuma entrega foi encontrada para o período selecionado.");
      return;
    }

    const html = gerarHtmlRelatorioEntregas({
      tipo: tipoRelatorioModal,
      funcionario: funcionarioSelecionado,
      registros: filtradas,
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
    resumoModalPeriodo,
    setPeriodoRelatorioInicio,
    setPeriodoRelatorioFim,
    resetarModalPeriodo,
    abrirModalRelatorioGeral,
    abrirModalRelatorioFuncionario,
    confirmarGeracaoRelatorio,
    limparModalPeriodo: () => {
      setPeriodoRelatorioInicio("");
      setPeriodoRelatorioFim("");
      setErroPeriodoModal("");
    },
    aplicarAtalhoPeriodo: ({ inicio, fim }) => {
      setPeriodoRelatorioInicio(inicio || "");
      setPeriodoRelatorioFim(fim || "");
      setErroPeriodoModal("");
    },
  };
}