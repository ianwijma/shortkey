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

export type TupleErrorReturn = [ErrorObject];
export type TupleSuccessReturn<T> = [undefined, T];
export type TupleReturn<T> = TupleErrorReturn | TupleSuccessReturn<T>;

export type MethodConfig = {
  methods: [];
};
export type AddonConfig = {
  addons: [];
};
