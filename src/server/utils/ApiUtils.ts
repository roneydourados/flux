import dayjs from "dayjs";
import { ServiceProps } from "~/interfaces/Service";

// O plugin duration e sua extensão foram removidos.
// import duration from "dayjs/plugin/duration";
// dayjs.extend(duration);

export const useServiceApiUtils = () => {
  // Esta função não depende do Day.js e permanece como está.
  const amountFormated = (value: number, isCurrencyStyle: boolean) => {
    return new Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: isCurrencyStyle ? "currency" : undefined,
    }).format(value);
  };

  /**
   * Calcula a duração e o valor para uma única ocorrência.
   */
  const calculeServiceTotalsOccurence = (
    ocStart?: string,
    ocEnd?: string,
    hourValue?: number
  ) => {
    if (ocStart && ocEnd && hourValue) {
      const initial = dayjs(ocStart);
      const final = dayjs(ocEnd);

      // Calcula a diferença diretamente em horas como um número decimal (ex: 2.5)
      const totalHoursNumber = final.diff(initial, "hours", true);

      // Calcula o valor com base no total de horas
      const valor = amountFormated(totalHoursNumber * hourValue, true);

      // Calcula as partes de HH:mm:ss a partir do total de horas
      const hours = Math.floor(totalHoursNumber);
      const minutes = Math.floor((totalHoursNumber * 60) % 60);
      const seconds = Math.floor((totalHoursNumber * 3600) % 60);

      // Formata os números para terem sempre dois dígitos
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      return {
        horas: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
        valor,
      };
    }
    return {
      horas: "Indefinida",
      valor: "R$ 0,00",
    };
  };

  /**
   * Calcula os totais (duração e valor) para um serviço completo.
   */
  const calculeServiceTotals = (service: ServiceProps) => {
    let totalHoursNumber = 0;

    // Usar forEach é mais adequado aqui do que map
    service.ServiceOccurrence?.forEach((oc) => {
      if (oc.started && oc.ended) {
        const initial = dayjs(oc.started);
        const final = dayjs(oc.ended);

        // Acumula a duração de cada ocorrência em horas decimais
        totalHoursNumber += final.diff(initial, "hours", true);
      }
    });

    // Calcula os valores com base no total de horas acumulado
    const valorNumber = totalHoursNumber * service.hourValue;
    const valor = amountFormated(valorNumber, false);

    // Calcula as partes de HH:mm:ss a partir do total de horas
    const hours = Math.floor(totalHoursNumber);
    const minutes = Math.floor((totalHoursNumber * 60) % 60);
    const seconds = Math.floor((totalHoursNumber * 3600) % 60);

    // Formata para o padrão HH:mm:ss
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return {
      horas: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
      valor,
      valorNumber,
      // Como o objeto `duration` foi removido, retornamos o total de horas em
      // formato decimal, que é mais útil para outros cálculos.
      totalHoursNumber,
    };
  };

  return {
    calculeServiceTotalsOccurence,
    calculeServiceTotals,
    amountFormated,
  };
};

/*
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
*/
