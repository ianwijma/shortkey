import { MethodId, TupleMethodReturn } from "../@types/common";
import { returnError, returnSuccess } from "./common";
import { ExitCodes } from "./exitCodes";

export async function runMethod(
  methodId: MethodId
): Promise<TupleMethodReturn> {
  return returnSuccess(`Method (ID=${methodId}) ran`);
}
