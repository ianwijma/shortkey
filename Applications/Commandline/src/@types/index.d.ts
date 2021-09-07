import { ExitCodes } from "../lib/exitCodes";

export interface ErrorObject {
  code: ExitCodes;
  message: string;
  original: Error;
}

export interface ExecuteObject {
  message?: string;
  warnings?: string[];
}

export type MethodId = string;

// TODO: Get rid of the `any` keyword
export type TupleReturnError = [ErrorObject, any];
export type TupleReturnSuccess<T> = [ErrorObject | null, T];
export type TupleReturn<T> = TupleReturnError | TupleReturnSuccess<T>;

export type MethodConfig = {
  methods: [];
};
export type AddonConfig = {
  addons: [];
};
