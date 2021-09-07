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

export type TupleReturnError = [ErrorObject];
export type TupleReturnSuccess<T> = [undefined, T];
export type TupleReturn<T> = TupleReturnError | TupleReturnSuccess<T>;

export type MethodConfig = {
  methods: [];
};
export type AddonConfig = {
  addons: [];
};
