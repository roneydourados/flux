import dayjs from "dayjs";
import { ServiceProps } from "~/interfaces/Service";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const useServiceApiUtils = () => {
  const amountFormated = (value: number, isCurrencyStyle: boolean) => {
    return new Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: isCurrencyStyle ? "currency" : undefined,
    }).format(value);
  };

  const calculeServiceTotalsOccurence = (
    ocStart?: string,
    ocEnd?: string,
    hourValue?: number
  ) => {
    if (ocStart && ocEnd && hourValue) {
      const inital = dayjs(ocStart); // substitua por sua primeira data
      const final = dayjs(ocEnd); // substitua por sua segunda data

      const duration = dayjs.duration(final.diff(inital)); // calcula a duração entre as duas datas

      const totalHours = String(Math.floor(duration.asHours())).padStart(
        2,
        "0"
      );
      const totalMinutes = String(
        Math.floor(duration.asMinutes()) % 60
      ).padStart(2, "0");
      const totalSeconds = String(
        Math.floor(duration.asSeconds()) % 60
      ).padStart(2, "0");

      const valor = amountFormated(duration.asHours() * hourValue, true);

      return {
        horas: `${totalHours}:${totalMinutes}:${totalSeconds}`,
        valor,
      };
    }
    return {
      horas: "Indefinida",
      valor: "R$ 0,00",
    };
  };

  const calculeServiceTotals = (service: ServiceProps) => {
    let totalHoursNumber = 0;

    service.ServiceOccurrence?.map((oc) => {
      if (oc.started && oc.ended) {
        const inital = dayjs(oc.started); // substitua por sua primeira data
        const final = dayjs(oc.ended); // substitua por sua segunda data

        const duration = dayjs.duration(final.diff(inital)); // calcula a duração entre as duas datas

        totalHoursNumber = totalHoursNumber + duration.asHours(); // soma a duração em horas
      }
    });

    const finalDuration = dayjs.duration(totalHoursNumber, "hours"); // converte as horas para duração

    const valor = amountFormated(
      finalDuration.asHours() * service.hourValue,
      false
    ); // obtém o valor em horas

    const valorNumber = finalDuration.asHours() * service.hourValue;

    // obtém o valor em horas

    const totalHours = String(Math.floor(finalDuration.asHours())).padStart(
      2,
      "0"
    );
    const totalMinutes = String(
      Math.floor(finalDuration.asMinutes()) % 60
    ).padStart(2, "0");
    const totalSeconds = String(
      Math.floor(finalDuration.asSeconds()) % 60
    ).padStart(2, "0");

    return {
      horas: `${totalHours}:${totalMinutes}:${totalSeconds}`,
      valor,
      valorNumber,
      finalDuration,
    };
  };

  return {
    calculeServiceTotalsOccurence,
    calculeServiceTotals,
    amountFormated,
  };
};
