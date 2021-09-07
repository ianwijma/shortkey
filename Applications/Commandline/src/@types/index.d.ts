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

export type ActionId = string;
export type MethodId = string;

// TODO: Get rid of the `any` keyword
export type TupleReturnError = [ErrorObject, any];
export type TupleReturnSuccess<T> = [ErrorObject | null, T];
export type TupleReturn<T> = TupleReturnError | TupleReturnSuccess<T>;

export interface ActionConfig {
  methods: MethodConfig[];
}

export interface AddonConfig {
  addon: string;
  path: string;
}

export interface MethodConfig {
  addons: AddonConfig[];
}

export interface MethodsConfig {
  methods: {
    [key: string]: string;
  };
}
export interface AddonConfig {
  addons: [];
}

export interface MethodImport {
  handle: Function;
}
