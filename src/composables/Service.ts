import dayjs from "dayjs";
import { type ServiceProps } from "@/interfaces/Service";

import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const useServiceUtils = () => {
  const { amountFormated } = useUtils();

  const calculeServiceTotalsOccurence = (
    ocStart?: string,
    ocEnd?: string,
    hourValue?: number
  ) => {
    if (ocStart && ocEnd && hourValue) {
      const startDate = dayjs(ocStart).format("YYYY-MM-DD HH:mm:ss");
      const endDate = dayjs(ocEnd).format("YYYY-MM-DD HH:mm:ss");

      const inital = dayjs(startDate); // substitua por sua primeira data
      const final = dayjs(endDate); // substitua por sua segunda data

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
        //deixar formatado para evitar diferenças de centavos
        const startDate = dayjs(oc.started).format("YYYY-MM-DD HH:mm:ss");
        const endDate = dayjs(oc.ended).format("YYYY-MM-DD HH:mm:ss");

        const inital = dayjs(startDate); // substitua por sua primeira data
        const final = dayjs(endDate); // substitua por sua segunda data

        const duration = dayjs.duration(final.diff(inital)); // calcula a duração entre as duas datas

        totalHoursNumber = totalHoursNumber + duration.asHours(); // soma a duração em horas
      }
    });

    const finalDuration = dayjs.duration(totalHoursNumber, "hours"); // converte as horas para duração

    const valor = amountFormated(
      finalDuration.asHours() * service.hourValue,
      true
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

  return { calculeServiceTotalsOccurence, calculeServiceTotals };
};
