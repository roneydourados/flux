import type { ServiceProps, ServiceFilterProps } from "@/interfaces/Service";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const useExportReport = () => {
  const exportReportPDF = (
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
          ? dayjs(service.serviceDate.substring(0, 10)).format("DD/MM/YYYY")
          : "",
        italics: false,
        color: "gray",
        alignment: "right",
      };

      console.log(
        "service.serviceEndDate",
        service.serviceEndDate?.substring(0, 10)
      );
      const serviceEndDate = {
        text: service.serviceEndDate
          ? dayjs(service.serviceEndDate.substring(0, 10)).format("DD/MM/YYYY")
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
    const finalDuration = dayjs.duration(totalHoursDuration, "hours"); // converte as horas para duração

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
              text: `Relatório de horas de ${dayjs(filters.initialDate).format(
                "DD/MM/YYYY"
              )} até ${dayjs(filters.finalDate).format("DD/MM/YYYY")}`,
              style: "subheader",
              margin: [0, 0, 0, 30],
            },
            {
              svg: `
                  <svg
                    height="400"
                    viewBox="0 0 2898 638"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M739.555 451H683.695V226.977H599.516V170.922H823.539V226.977H739.555V451ZM910.453 184.984C910.453 189.932 909.477 194.555 907.523 198.852C905.701 203.148 903.161 206.924 899.906 210.18C896.651 213.305 892.81 215.844 888.383 217.797C884.086 219.62 879.464 220.531 874.516 220.531C869.568 220.531 864.88 219.62 860.453 217.797C856.156 215.844 852.38 213.305 849.125 210.18C846 206.924 843.461 203.148 841.508 198.852C839.685 194.555 838.773 189.932 838.773 184.984C838.773 180.167 839.685 175.609 841.508 171.312C843.461 166.885 846 163.109 849.125 159.984C852.38 156.729 856.156 154.19 860.453 152.367C864.88 150.414 869.568 149.438 874.516 149.438C879.464 149.438 884.086 150.414 888.383 152.367C892.81 154.19 896.651 156.729 899.906 159.984C903.161 163.109 905.701 166.885 907.523 171.312C909.477 175.609 910.453 180.167 910.453 184.984ZM901.273 451H847.562V241.82H901.273V451ZM1208.11 451H1154.98V318.188C1154.98 314.542 1154.27 311.091 1152.84 307.836C1151.53 304.581 1149.65 301.716 1147.17 299.242C1144.7 296.768 1141.83 294.88 1138.58 293.578C1135.32 292.146 1131.87 291.43 1128.23 291.43C1124.58 291.43 1121.13 292.146 1117.88 293.578C1114.75 294.88 1111.95 296.768 1109.48 299.242C1107.13 301.716 1105.24 304.581 1103.81 307.836C1102.51 311.091 1101.86 314.542 1101.86 318.188V451H1048.54V318.188C1048.54 314.542 1047.82 311.091 1046.39 307.836C1045.09 304.581 1043.2 301.716 1040.73 299.242C1038.25 296.768 1035.39 294.88 1032.13 293.578C1028.88 292.146 1025.43 291.43 1021.78 291.43C1018.14 291.43 1014.68 292.146 1011.43 293.578C1008.3 294.88 1005.51 296.768 1003.03 299.242C1000.69 301.716 998.799 304.581 997.367 307.836C996.065 311.091 995.414 314.542 995.414 318.188V451H942.094V241.82H954.984L969.438 257.836C976.859 251.586 984.997 246.768 993.852 243.383C1002.84 239.867 1012.15 238.109 1021.78 238.109C1031.55 238.109 1041.05 239.932 1050.3 243.578C1059.67 247.224 1067.88 253.539 1074.91 262.523C1078.16 258.096 1081.87 254.32 1086.04 251.195C1090.21 248.07 1094.57 245.531 1099.12 243.578C1103.81 241.625 1108.63 240.258 1113.58 239.477C1118.53 238.565 1123.41 238.109 1128.23 238.109C1139.29 238.109 1149.65 240.193 1159.28 244.359C1169.05 248.526 1177.51 254.255 1184.67 261.547C1191.96 268.708 1197.69 277.172 1201.86 286.938C1206.03 296.703 1208.11 307.12 1208.11 318.188V451ZM1330.38 399.828C1332.46 400.479 1334.54 400.935 1336.62 401.195C1338.71 401.326 1340.79 401.391 1342.88 401.391C1348.08 401.391 1353.1 400.674 1357.91 399.242C1362.73 397.81 1367.22 395.792 1371.39 393.188C1375.69 390.453 1379.46 387.198 1382.72 383.422C1386.1 379.516 1388.84 375.219 1390.92 370.531L1429.98 409.789C1425.04 416.82 1419.31 423.135 1412.8 428.734C1406.42 434.333 1399.45 439.086 1391.9 442.992C1384.48 446.898 1376.6 449.828 1368.27 451.781C1360.06 453.865 1351.6 454.906 1342.88 454.906C1328.16 454.906 1314.29 452.172 1301.27 446.703C1288.38 441.234 1277.05 433.617 1267.29 423.852C1257.65 414.086 1250.04 402.497 1244.44 389.086C1238.84 375.544 1236.04 360.701 1236.04 344.555C1236.04 328.018 1238.84 312.914 1244.44 299.242C1250.04 285.57 1257.65 273.917 1267.29 264.281C1277.05 254.646 1288.38 247.159 1301.27 241.82C1314.29 236.482 1328.16 233.812 1342.88 233.812C1351.6 233.812 1360.13 234.854 1368.46 236.938C1376.79 239.021 1384.67 242.016 1392.09 245.922C1399.65 249.828 1406.68 254.646 1413.19 260.375C1419.7 265.974 1425.43 272.289 1430.38 279.32L1330.38 399.828ZM1357.72 289.867C1355.24 288.956 1352.77 288.37 1350.3 288.109C1347.95 287.849 1345.48 287.719 1342.88 287.719C1335.58 287.719 1328.68 289.086 1322.17 291.82C1315.79 294.424 1310.19 298.201 1305.38 303.148C1300.69 308.096 1296.98 314.086 1294.24 321.117C1291.51 328.018 1290.14 335.831 1290.14 344.555C1290.14 346.508 1290.21 348.721 1290.34 351.195C1290.6 353.669 1290.92 356.208 1291.31 358.812C1291.83 361.286 1292.42 363.695 1293.07 366.039C1293.72 368.383 1294.57 370.466 1295.61 372.289L1357.72 289.867ZM1510.65 451H1457.33V241.82H1470.22L1487.8 266.625C1496.39 258.812 1506.16 252.823 1517.09 248.656C1528.03 244.359 1539.36 242.211 1551.08 242.211H1598.15V295.336H1551.08C1545.48 295.336 1540.21 296.378 1535.26 298.461C1530.31 300.544 1526.01 303.409 1522.37 307.055C1518.72 310.701 1515.86 314.997 1513.77 319.945C1511.69 324.893 1510.65 330.167 1510.65 335.766V451ZM1964.36 422.289C1951.34 433.487 1936.76 442.081 1920.61 448.07C1904.46 454.06 1887.73 457.055 1870.41 457.055C1857.13 457.055 1844.31 455.297 1831.94 451.781C1819.7 448.396 1808.17 443.578 1797.37 437.328C1786.69 430.948 1776.92 423.331 1768.07 414.477C1759.22 405.622 1751.6 395.857 1745.22 385.18C1738.97 374.372 1734.09 362.849 1730.57 350.609C1727.18 338.24 1725.49 325.414 1725.49 312.133C1725.49 298.852 1727.18 286.026 1730.57 273.656C1734.09 261.286 1738.97 249.763 1745.22 239.086C1751.6 228.279 1759.22 218.448 1768.07 209.594C1776.92 200.74 1786.69 193.188 1797.37 186.938C1808.17 180.557 1819.7 175.674 1831.94 172.289C1844.31 168.773 1857.13 167.016 1870.41 167.016C1887.73 167.016 1904.46 170.01 1920.61 176C1936.76 181.859 1951.34 190.453 1964.36 201.781L1934.67 250.609C1926.47 241.755 1916.77 234.984 1905.57 230.297C1894.37 225.479 1882.65 223.07 1870.41 223.07C1858.04 223.07 1846.46 225.414 1835.65 230.102C1824.84 234.789 1815.4 241.169 1807.33 249.242C1799.26 257.185 1792.88 266.625 1788.19 277.562C1783.5 288.37 1781.16 299.893 1781.16 312.133C1781.16 324.372 1783.5 335.896 1788.19 346.703C1792.88 357.38 1799.26 366.755 1807.33 374.828C1815.4 382.901 1824.84 389.281 1835.65 393.969C1846.46 398.656 1858.04 401 1870.41 401C1882.65 401 1894.37 398.656 1905.57 393.969C1916.77 389.151 1926.47 382.315 1934.67 373.461L1964.36 422.289ZM2186.04 344.555C2186.04 360.18 2183.24 374.763 2177.64 388.305C2172.04 401.716 2164.42 413.37 2154.79 423.266C2145.15 433.031 2133.83 440.779 2120.8 446.508C2107.91 452.107 2094.05 454.906 2079.2 454.906C2064.49 454.906 2050.62 452.107 2037.6 446.508C2024.71 440.779 2013.38 433.031 2003.62 423.266C1993.98 413.37 1986.36 401.716 1980.77 388.305C1975.17 374.763 1972.37 360.18 1972.37 344.555C1972.37 328.669 1975.17 313.956 1980.77 300.414C1986.36 286.872 1993.98 275.219 2003.62 265.453C2013.38 255.557 2024.71 247.81 2037.6 242.211C2050.62 236.612 2064.49 233.812 2079.2 233.812C2094.05 233.812 2107.91 236.482 2120.8 241.82C2133.83 247.029 2145.15 254.516 2154.79 264.281C2164.42 273.917 2172.04 285.57 2177.64 299.242C2183.24 312.784 2186.04 327.888 2186.04 344.555ZM2132.33 344.555C2132.33 335.961 2130.9 328.214 2128.03 321.312C2125.3 314.281 2121.52 308.292 2116.7 303.344C2111.89 298.266 2106.22 294.424 2099.71 291.82C2093.33 289.086 2086.49 287.719 2079.2 287.719C2071.91 287.719 2065.01 289.086 2058.5 291.82C2052.12 294.424 2046.52 298.266 2041.7 303.344C2037.02 308.292 2033.3 314.281 2030.57 321.312C2027.84 328.214 2026.47 335.961 2026.47 344.555C2026.47 352.628 2027.84 360.115 2030.57 367.016C2033.3 373.917 2037.02 379.906 2041.7 384.984C2046.52 390.062 2052.12 394.099 2058.5 397.094C2065.01 399.958 2071.91 401.391 2079.2 401.391C2086.49 401.391 2093.33 400.023 2099.71 397.289C2106.22 394.555 2111.89 390.714 2116.7 385.766C2121.52 380.818 2125.3 374.828 2128.03 367.797C2130.9 360.766 2132.33 353.018 2132.33 344.555ZM2369.24 426.586C2364.95 430.492 2360.32 434.203 2355.38 437.719C2350.56 441.104 2345.48 444.099 2340.14 446.703C2334.8 449.177 2329.27 451.13 2323.54 452.562C2317.94 454.125 2312.21 454.906 2306.35 454.906C2293.46 454.906 2281.35 452.628 2270.02 448.07C2258.7 443.513 2248.73 437.068 2240.14 428.734C2231.68 420.271 2224.97 410.049 2220.02 398.07C2215.21 385.961 2212.8 372.419 2212.8 357.445V241.82H2265.92V357.445C2265.92 364.477 2266.96 370.792 2269.05 376.391C2271.26 381.859 2274.19 386.482 2277.84 390.258C2281.48 394.034 2285.71 396.898 2290.53 398.852C2295.48 400.805 2300.75 401.781 2306.35 401.781C2311.82 401.781 2316.96 400.544 2321.78 398.07C2326.73 395.466 2331.03 392.081 2334.67 387.914C2338.32 383.747 2341.18 379.06 2343.27 373.852C2345.35 368.513 2346.39 363.044 2346.39 357.445V241.82H2399.71V451H2386.82L2369.24 426.586ZM2493.85 451H2440.53V241.82H2453.42L2471 262.133C2479.59 254.32 2489.29 248.331 2500.1 244.164C2511.04 239.867 2522.43 237.719 2534.28 237.719C2547.04 237.719 2559.09 240.193 2570.41 245.141C2581.74 249.958 2591.64 256.664 2600.1 265.258C2608.57 273.721 2615.21 283.682 2620.02 295.141C2624.97 306.469 2627.45 318.578 2627.45 331.469V451H2574.12V331.469C2574.12 326 2573.08 320.857 2571 316.039C2568.92 311.091 2566.05 306.794 2562.41 303.148C2558.76 299.503 2554.53 296.638 2549.71 294.555C2544.89 292.471 2539.75 291.43 2534.28 291.43C2528.68 291.43 2523.41 292.471 2518.46 294.555C2513.51 296.638 2509.22 299.503 2505.57 303.148C2501.92 306.794 2499.06 311.091 2496.98 316.039C2494.89 320.857 2493.85 326 2493.85 331.469V451ZM2767.68 451C2754.79 451 2742.68 448.591 2731.35 443.773C2720.02 438.826 2710.06 432.12 2701.47 423.656C2693.01 415.062 2686.3 405.102 2681.35 393.773C2676.53 382.445 2674.12 370.336 2674.12 357.445V295.336H2648.15V242.211H2674.12V158.617H2727.25V242.211H2808.11V295.336H2727.25V357.445C2727.25 363.044 2728.29 368.318 2730.38 373.266C2732.46 378.083 2735.32 382.315 2738.97 385.961C2742.61 389.607 2746.91 392.536 2751.86 394.75C2756.81 396.833 2762.08 397.875 2767.68 397.875H2808.11V451H2767.68Z"
                      fill="#00BD62"
                    />
                    <path
                      d="M412.645 359.518L269.891 506.299L190.482 424.601L333.236 277.821L269.688 212.531L62.8135 425.324L269.148 637.531L476.057 424.739L412.645 359.518Z"
                      fill="#BDBDBD"
                    />
                    <path
                      d="M540.62 224.068L270.682 0L0 224.707L0.878508 329.736L269.499 106.696L540.147 331.376L540.62 224.068Z"
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

  const exportReportExcel = (
    services: ServiceProps[],
    filters: ServiceFilterProps
  ) => {
    const { amountFormated } = useUtils();
    const { user } = useUserSession();

    let totalHoursDuration = 0;

    const serviceArray = services.map((service) => {
      const totals = totalHoursService(service);
      totalHoursDuration += totals.totalHoursNumber;

      return {
        Projeto: service.ClientProject?.name,
        Tarefa: service.title,
        Inicio: dayjs(service.serviceDate?.substring(0, 10)).format(
          "DD/MM/YYYY"
        ),
        Fim: service.serviceEndDate
          ? dayjs(service.serviceEndDate.substring(0, 10)).format("DD/MM/YYYY")
          : "Aberta",
        // Duração como decimal de dias (para Excel entender como tempo)
        Duracao:
          dayjs.duration(totals.totalHoursNumber, "hours").asMilliseconds() /
          (1000 * 60 * 60 * 24),
        ValorHora: amountFormated(service.hourValue, false),
        Total: Number(totals.valor.replace("R$", "").replace(",", ".")),
      };
    });

    const filename = `Relatório de horas de ${user.value?.name} ${dayjs(
      filters.initialDate
    ).format("DD/MM/YYYY")} até ${dayjs(filters.finalDate).format(
      "DD/MM/YYYY"
    )}.xlsx`;

    const worksheet = XLSX.utils.json_to_sheet(serviceArray);

    // Total de linhas (dados + cabeçalho)
    const totalRows = serviceArray.length + 1;
    const totalRowIndex = totalRows + 1;

    // Soma de Duracao (coluna E)
    worksheet[`E${totalRowIndex}`] = {
      t: "n",
      f: `SUM(E2:E${totalRows})`,
    };

    // Soma de Total (coluna G)
    worksheet[`G${totalRowIndex}`] = {
      t: "n",
      f: `SUM(G2:G${totalRows})`,
    };

    // Rótulo "TOTAL"
    worksheet[`A${totalRowIndex}`] = {
      t: "s",
      v: "TOTAL",
    };

    // Atualiza o intervalo do worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    range.e.r = totalRowIndex - 1;
    worksheet["!ref"] = XLSX.utils.encode_range(range);

    // ⬇️ Estilo para quebra de linha na coluna "Tarefa" (coluna B = index 1)
    // for (let row = range.s.r + 1; row <= range.e.r; row++) {
    //   const cellRef = XLSX.utils.encode_cell({ r: row, c: 1 }); // coluna B
    //   const cell = worksheet[cellRef];
    //   if (cell) {
    //     cell.s = {
    //       alignment: {
    //         wrapText: true,
    //         vertical: "center",
    //         horizontal: "center",
    //       },
    //     };
    //   }
    // }

    // 📐 Define larguras das colunas
    worksheet["!cols"] = [
      { wch: 20 }, // Projeto
      { wch: 100 }, // Tarefa
      { wch: 15 }, // Início
      { wch: 15 }, // Fim
      { wch: 12, z: "hh:mm:ss" } as any, // Duração (formato tempo)
      { wch: 12 }, // ValorHora
      { wch: 15 }, // Total
    ];

    // 📤 Exporta o arquivo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tarefas");
    XLSX.writeFile(workbook, filename);
  };

  return { exportReportPDF, exportReportExcel };
};

// const totalHoursService = (service: ServiceProps) => {
//   const { amountFormated } = useUtils();

//   let totalHoursNumber = 0;

//   // Use forEach para iterar, pois não estamos criando um novo array
//   service.ServiceOccurrence?.forEach((oc) => {
//     if (oc.started && oc.ended) {
//       const initial = dayjs(oc.started);
//       const final = dayjs(oc.ended);

//       // Calcula a diferença em horas como um número de ponto flutuante (ex: 1.5)
//       const hoursDifference = final.diff(initial, "hours", true);

//       totalHoursNumber += hoursDifference;
//     }
//   });

//   // 'totalHoursNumber' já é o total de horas em formato decimal
//   const valorTotal = totalHoursNumber * service.hourValue;
//   const valor = amountFormated(valorTotal, false);

//   // --- Cálculo manual para o formato HH:mm:ss ---
//   const hours = Math.floor(totalHoursNumber);
//   const minutes = Math.floor((totalHoursNumber * 60) % 60);
//   const seconds = Math.floor((totalHoursNumber * 3600) % 60);

//   // Formata os valores para garantir dois dígitos (ex: 01, 09, 15)
//   const formattedHours = String(hours).padStart(2, "0");
//   const formattedMinutes = String(minutes).padStart(2, "0");
//   const formattedSeconds = String(seconds).padStart(2, "0");

//   return {
//     horas: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
//     valor,
//     totalHoursNumber, // Duração total em horas (ex: 8.5)
//     valorTotal,
//   };
// };

const totalHoursService = (service: ServiceProps) => {
  const { amountFormated } = useUtils();

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
