import moment from "moment";

export default defineEventHandler((event) => {
  const req = getRequestURL(event);

  if (
    req.pathname.includes("/api/") &&
    event.method.toUpperCase() !== "OPTIONS"
  ) {
    //const headers = getHeaders(event);
    console.log("data/hora: ", moment().format("DD/MM/YYYY HH:mm:ss"));
    console.log("Acessando: " + getRequestURL(event));
    console.log("Method: ", event.method);
    //console.log("Headers: ", headers.authorization?.split(" ")[1]);
    //console.log("Headers Full: ", headers);
  }
});
