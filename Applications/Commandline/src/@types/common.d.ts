import { ExitCodes } from "../lib/exitCodes";

export type ErrorObject = {
  code: ExitCodes;
  message: string;
  original: Error;
};

export type MethodId = string;
export type TupleMethodReturn = [ErrorObject] | [undefined, any];
