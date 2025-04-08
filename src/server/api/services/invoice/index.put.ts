import { invoiceServices } from "~/server/repositories/serviceRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const {
      initialDate,
      finalDate,
      clientId,
      invoiced,
      categoryId,
      paymentMethod,
      total,
      dueDate,
    } = await readBody(event);

    setResponseStatus(event, 200);

    return invoiceServices({
      initialDate: String(initialDate),
      finalDate: String(finalDate),
      clientId: Number(clientId),
      invoiced: Boolean(invoiced),
      userId: user.id,
      categoryId: categoryId ? Number(categoryId) : undefined,
      paymentMethod: paymentMethod ? String(paymentMethod) : undefined,
      total: total ? Number(total) : 0,
      dueDate,
    });
  }
});
