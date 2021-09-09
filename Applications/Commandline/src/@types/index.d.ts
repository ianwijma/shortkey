import { ExitCodes } from "../lib/exitCodes";

export interface ErrorObject {
  code: ExitCodes;
  message: string;
  original: Error;
}

export interface ExecuteObject {
  message?: string;
  warnings?: string[];
  stepExecutions?: number;
}

export type ActionId = string;
export type MethodId = string;
export type AddonId = string;

export type MethodName = string;
export type AddonName = string;

// TODO: Get rid of the `any` keyword
export type TupleReturnError = [ErrorObject, any];
export type TupleReturnSuccess<T> = [ErrorObject | null, T];
export type TupleReturn<T> = TupleReturnError | TupleReturnSuccess<T>;

export interface ImportedMethodSettings {
  [key: string]: any; // TODO: refine the settings
}

export interface MethodSettings extends ImportedMethodSettings {
  label: string; // name = static, label = change-able
}

export interface ImportedMethod {
  name: string;
  handle: function;
  settings: ImportedMethodSettings;
}

export type ActionStepId = string;
export interface ActionStep {
  id: ActionStepId;
  nextIds: ActionStepId[];
  methodId: MethodId;
  methodSettings: MethodSettings;
}

export interface ActionSteps {
  [actionId: ActionStepId]: ActionStep;
}

export interface ActionConfig {
  firstActionStepIds: ActionStepId[];
  actionSteps: ActionSteps;
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
