import dayjs from "dayjs";
import { formatCNPJ, formatCPF } from "@brazilian-utils/brazilian-utils";
type CompactDisplayType = "short" | "long" | undefined;

export const useUtils = () => {
  const amountFormated = (
    value: number,
    isCurrencyStyle: boolean,
    compactDisplay: CompactDisplayType = undefined
  ) => {
    return new Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: isCurrencyStyle ? "currency" : undefined,
      compactDisplay,
      notation: compactDisplay ? "compact" : undefined,
    }).format(value);
  };

  const cardInvoices = () => {
    let dayjsDate = dayjs();
    let invoices = [] as String[];

    for (let i = 1; i <= 48; i++) {
      invoices.push(
        `${dayjs(dayjsDate).format("MM")}/${dayjs(dayjsDate).format("yyyy")}`
      );

      dayjsDate = dayjs(dayjsDate).add(1, "months");
    }

    return invoices;
  };

  const numberOnly = (text: string) => {
    return !isNaN(Number(text));
  };

  const formatDate = (date?: string) => {
    if (date) {
      return dayjs(date.substring(0, 10)).format("DD/MM/YYYY");
    }

    return dayjs().format("DD/MM/YYYY");
  };

  const extenseDate = (date?: string) => {
    let data = new Date();

    if (date) {
      data = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formato = new Intl.DateTimeFormat("pt-BR", options);

    return formato.format(data);
  };

  const formatTelephoneNumber = (telephoneNumber: string) => {
    if (!telephoneNumber) {
      return "";
    }

    return telephoneNumber.replace(
      /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/,
      "($1) $2-$3"
    );
  };

  const decimalFormated = (value: number, numberPlaces: number) => {
    return new Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: numberPlaces,
    }).format(value);
  };

  const age = (dateBirth: string) => {
    if (!dateBirth) {
      return 0;
    }

    const currentYear = dayjs().year();
    const birthYear = dayjs(dateBirth).year();

    const currentMonth = dayjs().month();
    const birthMonth = dayjs(dateBirth).month();

    if (birthMonth === currentMonth && birthYear === currentYear) {
      return `${dayjs().diff(dateBirth, "days")} ${
        dayjs().diff(dateBirth, "days") > 1 ? "dias" : "dia"
      }`;
    }

    if (birthYear === currentYear) {
      return `${dayjs().diff(dateBirth, "months")} ${
        dayjs().diff(dateBirth, "months") > 1 ? "meses" : "mês"
      }`;
    }

    return `${dayjs().diff(dateBirth, "years")} ${
      dayjs().diff(dateBirth, "years") > 1 ? "anos" : "ano"
    }`;
  };

  const getInitials = (name: string) => {
    if (!name) {
      return "";
    }

    const hasSpace = !name.includes(" ") ? name.includes(" ") : name;

    const formattedName = hasSpace ? name : `${name} `;
    const [firstName, lastName] = formattedName.split(" ");

    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  };

  const calculateEndTime = (
    initialHour: string,
    initialDate: string,
    intervalMinutes: number
  ) => {
    if (!initialHour || !initialDate || !intervalMinutes) {
      return "Aguardando agenda...";
    }

    const endDate = dayjs(`${initialDate} ${initialHour}`)
      .add(intervalMinutes, "minutes")
      .format("HH:mm");

    return endDate;
  };

  const calculateEventInterval = (
    initialHour: string,
    initialDate: string,
    intervalMinutes: number
  ) => {
    if (!initialHour || !initialDate || !intervalMinutes) {
      return {
        start: "",
        end: "",
      };
    }

    const start = `${dayjs(`${initialDate} ${initialHour}`).format(
      "YYYY-MM-DD HH:mm:ss"
    )}`;

    const end = `${dayjs(`${initialDate} ${initialHour}`)
      .add(intervalMinutes, "minutes")
      .format("YYYY-MM-DD HH:mm:ss")}`;

    return {
      start,
      end,
    };
  };

  const validateDateInterval = (initialDate: string, finalDate: string) => {
    return dayjs(initialDate).isAfter(finalDate);
  };

  const difDays = (initialDate: string, finalDate: string) => {
    const initDate = dayjs(initialDate);
    const endDate = dayjs(finalDate);

    return endDate.diff(initDate, "days");
  };

  const formatCPFOrCNPJ = (value: string) => {
    if (value.length === 11) {
      return formatCPF(value);
    }

    return formatCNPJ(value);
  };

  const stringToHandlePDF = (value: string) => {
    // Criar um iframe temporário
    const iframe = document.createElement("iframe");

    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    // Escrever o conteúdo HTML no iframe e chamar a impressão
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(value);
      iframe.contentDocument.close();
    }

    if (iframe.contentWindow) {
      // Remover após a impressão
      iframe.contentWindow.onafterprint = () =>
        document.body.removeChild(iframe);
      iframe.contentWindow.print();
    }
  };

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getTransactions = async () => {
    const transactionStore = useTransactionStore();

    const year = localStorage.getItem("year_transaction") || dayjs().year();

    const initial = `${year}-${
      Number(localStorage.getItem("month_transaction") || dayjs().month()) + 1
    }-01`;
    const status = localStorage.getItem("status_transaction") || undefined;

    const initialDate = dayjs(initial).startOf("month").format("YYYY-MM-DD");
    const finalDate = dayjs(initial).endOf("month").format("YYYY-MM-DD");

    await transactionStore.index({
      initialDate,
      finalDate,
      status,
    });

    await transactionStore.chartMonth({
      initialDate,
      finalDate,
    });
  };

  const getFiltersStoreServices = (): ServiceFilterProps => {
    const f = localStorage.getItem("serviceFilters");

    if (f) {
      return JSON.parse(f);
    }

    return {
      ClientProject: undefined,
      Client: undefined,
      month: dayjs().month(),
      year: dayjs().year(),
      initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      invoiced: "Todas",
    };
  };

  const saveServiceFilters = (filters: ServiceFilterProps) => {
    localStorage.setItem("serviceFilters", JSON.stringify(filters));
  };

  const clearFilters = () => {
    localStorage.removeItem("serviceFilters");
  };

  return {
    amountFormated,
    cardInvoices,
    numberOnly,
    formatDate,
    formatTelephoneNumber,
    decimalFormated,
    age,
    getInitials,
    calculateEndTime,
    calculateEventInterval,
    validateDateInterval,
    difDays,
    extenseDate,
    formatCPFOrCNPJ,
    stringToHandlePDF,
    generateRandomColor,
    getTransactions,
    getFiltersStoreServices,
    saveServiceFilters,
    clearFilters,
  };
};
