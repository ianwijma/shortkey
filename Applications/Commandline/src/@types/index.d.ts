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

export type Settings = ""; // TODO: find what what I was trying to do here :P

export type AddonSetting = string; // TODO: refine the settings
export interface AddonSettings {
  [key: string]: AddonSetting;
}

export type MethodSetting = string; // TODO: refine the settings
export interface MethodSettings {
  label: string; // name = static, label = change-able
  value: any;
  [key: string]: MethodSetting;
}

export interface ImportedAddon {
  name: string;
  description?: string;
  handle?: function;
  settings?: AddonSettings;
}

export interface ImportedMethod {
  name: string;
  description?: string;
  handle: function;
  settings?: AddonSettings;
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
