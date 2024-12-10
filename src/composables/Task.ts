import moment from "moment";
import { type ServiceProps } from "@/interfaces/Service";

export const useServiceUtils = () => {
  const { amountFormated } = useUtils();

  const calculeServiceTotalsOccurence = (
    ocStart?: string,
    ocEnd?: string,
    hourValue?: number
  ) => {
    if (ocStart && ocEnd && hourValue) {
      const startDate = moment(ocStart).format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment(ocEnd).format("YYYY-MM-DD HH:mm:ss");

      const inital = moment(startDate); // substitua por sua primeira data
      const final = moment(endDate); // substitua por sua segunda data

      const duration = moment.duration(final.diff(inital)); // calcula a duração entre as duas datas

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

  const calculeServiceTotals = (task: ServiceProps) => {
    let totalHoursNumber = 0;

    task.ServiceOccurrence?.map((oc) => {
      if (oc.started && oc.ended) {
        //deixar formatado para evitar diferenças de centavos
        const startDate = moment(oc.started).format("YYYY-MM-DD HH:mm:ss");
        const endDate = moment(oc.ended).format("YYYY-MM-DD HH:mm:ss");

        const inital = moment(startDate); // substitua por sua primeira data
        const final = moment(endDate); // substitua por sua segunda data

        const duration = moment.duration(final.diff(inital)); // calcula a duração entre as duas datas

        totalHoursNumber = totalHoursNumber + duration.asHours(); // soma a duração em horas
      }
    });

    const finalDuration = moment.duration(totalHoursNumber, "hours"); // converte as horas para duração

    const valor = amountFormated(
      finalDuration.asHours() * task.hourValue,
      true
    ); // obtém o valor em horas

    const valorNumber = finalDuration.asHours() * task.hourValue;

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
