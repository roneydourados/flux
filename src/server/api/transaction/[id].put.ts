import moment from "moment";
import { TransactionProps } from "~/interfaces/Transaction";
import { update } from "~/server/repositories/transactionRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useJwtToken();
  const user = userLogged(event);

  if (user && user.id) {
    const body = await readBody<TransactionProps>(event);

    setResponseStatus(event, 200);

    return update(body);
  }
});
