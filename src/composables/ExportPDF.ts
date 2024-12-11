import type { ServiceProps, ServiceFilterProps } from "@/interfaces/Service";
import moment from "moment";

export const useExportPDF = () => {
  const serviceReport = (
    services: ServiceProps[],
    filters: ServiceFilterProps
  ) => {
    const { amountFormated } = useUtils();
    const { user } = useUserSession();

    let totalHoursDuration = 0;
    let totalValue = 0;

    const serviceArray = services.map((service): any[] => {
      const totals = totalHoursService(service);

      const project = {
        text: service.ClientProject?.name,
        italics: false,
        color: "gray",
      };

      const title = {
        text: service.title,
        italics: false,
        color: "gray",
      };

      const serviceDate = {
        text: service.serviceDate
          ? moment(service.serviceDate.substring(0, 10)).format("DD/MM/YYYY")
          : "",
        italics: false,
        color: "gray",
        alignment: "right",
      };

      const serviceEndDate = {
        text: service.serviceEndDate
          ? moment(service.serviceEndDate.substring(0, 10)).format("DD/MM/YYYY")
          : "Aberta",
        italics: false,
        color: "gray",
        alignment: "right",
      };

      const serviceHourValue = {
        text: amountFormated(service.hourValue, false),
        italics: false,
        color: "gray",
        alignment: "right",
      };

      const serviceDuration = {
        text: totals.horas,
        italics: false,
        color: "gray",
        alignment: "right",
      };

      const serviceTotal = {
        text: totals.valor,
        italics: false,
        color: "gray",
        alignment: "right",
      };

      totalHoursDuration = totalHoursDuration + totals.totalHoursNumber;
      totalValue = totalValue + totals.valorTotal;

      return [
        project,
        title,
        serviceDate,
        serviceEndDate,
        serviceDuration,
        serviceHourValue,
        serviceTotal,
      ];
    });

    // calcular duracao total
    const finalDuration = moment.duration(totalHoursDuration, "hours"); // converte as horas para duração

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

    const itemsHeader = [
      { text: "Projeto", alignment: "left", bold: true, fontSize: 14 },
      { text: "Serviço", alignment: "left", bold: true, fontSize: 14 },
      { text: "Início", alignment: "right", bold: true, fontSize: 14 },
      { text: "Fim", alignment: "right", bold: true, fontSize: 14 },
      { text: "Duração", alignment: "right", bold: true, fontSize: 14 },
      { text: "Vlr hora", alignment: "right", bold: true, fontSize: 14 },
      { text: "Total", alignment: "right", bold: true, fontSize: 14 },
    ];

    const bodyTableItems = [itemsHeader, ...serviceArray];

    const reportData = {
      pageSize: "A3",
      content: [
        {
          columns: [
            {
              text: `Relatório de horas de ${moment(filters.initialDate).format(
                "DD/MM/YYYY"
              )} até ${moment(filters.finalDate).format("DD/MM/YYYY")}`,
              style: "subheader",
              margin: [0, 0, 0, 30],
            },
            {
              svg: `
                    <svg
                        height="400"
                        viewBox="0 0 1627 638"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M690.93 431H637.678V164.926H823.967V218.178H690.93V271.43H770.715V324.682H690.93V431ZM897.072 431H846.047V153.236H897.072V431ZM1081.88 407.807C1077.79 411.518 1073.4 415.043 1068.7 418.383C1064.13 421.599 1059.3 424.444 1054.23 426.918C1049.16 429.268 1043.9 431.124 1038.46 432.484C1033.14 433.969 1027.7 434.711 1022.13 434.711C1009.88 434.711 998.381 432.546 987.619 428.217C976.857 423.887 967.395 417.764 959.23 409.848C951.19 401.807 944.82 392.097 940.119 380.717C935.542 369.213 933.254 356.348 933.254 342.123V232.279H983.723V342.123C983.723 348.803 984.712 354.802 986.691 360.121C988.794 365.316 991.577 369.708 995.041 373.295C998.505 376.882 1002.52 379.604 1007.1 381.459C1011.8 383.314 1016.81 384.242 1022.13 384.242C1027.33 384.242 1032.21 383.067 1036.79 380.717C1041.49 378.243 1045.57 375.027 1049.04 371.068C1052.5 367.11 1055.22 362.657 1057.2 357.709C1059.18 352.637 1060.17 347.442 1060.17 342.123V232.279H1110.82V431H1098.58L1081.88 407.807ZM1332.55 431H1270.58L1231.06 370.141L1191.16 431H1129.19L1201.74 329.135L1129.19 231.166H1191.16L1231.06 288.129L1270.58 231.166H1332.55L1259.82 329.135L1332.55 431Z"
                          fill="#00BD62"
                        />
                        <path
                          d="M424.384 359.518L277.569 506.299L195.901 424.601L342.716 277.82L277.361 212.531L64.6006 425.323L276.806 637.531L489.601 424.739L424.384 359.518Z"
                          fill="#616161"
                        />
                        <path
                          d="M556 224.068L278.382 0L0 224.707L0.903501 329.736L277.166 106.696L555.514 331.376L556 224.068Z"
                          fill="#00BD62"
                        />
                      </svg>              
              `,
              width: 200,
              margin: [26, 0, 0, 30],
            },
          ],
        },

        {
          columns: [
            {
              color: "#2196F3",
              // margin: [left, top, right, bottom]
              margin: [0, 15, 5, 0],
              text: user.value?.name,
              bold: true,
              fontSize: 16,
            },
            {
              width: 70,
              color: "gray",
              // margin: [left, top, right, bottom]
              margin: [0, 15, 5, 0],
              text: "Total Horas:",
            },
            {
              width: 90,
              style: "subheader",
              text: `${totalHours}:${totalMinutes}:${totalSeconds}`,
            },
            {
              width: 70,
              color: "gray",
              // margin: [left, top, right, bottom]
              margin: [0, 15, 5, 0],
              text: "Valor Total:",
            },
            {
              width: 90,
              style: "subheader",
              text: amountFormated(Number(totalValue.toFixed(2)), false),
            },
          ],
        },

        {
          style: "tableExample",
          table: {
            widths: [150, 230, 70, 70, 60, 60, 70],
            body: bodyTableItems,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
    };

    return reportData;
  };

  return { serviceReport };
};

const totalHoursService = (service: ServiceProps) => {
  const { amountFormated } = useUtils();

  let totalHoursNumber = 0;

  service.ServiceOccurrence?.map((oc) => {
    if (oc.started && oc.ended) {
      const inital = moment(oc.started); // substitua por sua primeira data
      const final = moment(oc.ended); // substitua por sua segunda data

      const duration = moment.duration(final.diff(inital)); // calcula a duração entre as duas datas

      totalHoursNumber = totalHoursNumber + duration.asHours(); // soma a duração em horas
    }
  });

  const finalDuration = moment.duration(totalHoursNumber, "hours"); // converte as horas para duração

  const valor = amountFormated(
    finalDuration.asHours() * service.hourValue,
    false
  );

  // obtém o valor em horas
  const valorTotal = finalDuration.asHours() * service.hourValue;

  // formata a duração para HH:mm:ss
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
    totalHoursNumber,
    valorTotal,
  };
};
