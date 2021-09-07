import {
  AddonConfig,
  ExecuteObject,
  MethodsConfig,
  MethodId,
  TupleReturn,
  MethodConfig,
  MethodImport,
} from "../@types";
import { loadAddons } from "./addon";
import { returnError, returnErrorFromString, returnSuccess } from "./common";
import { readConfigFile } from "./config";
import { ExitCodes } from "./exitCodes";

export async function runMethod(
  methodId: MethodId
): Promise<TupleReturn<ExecuteObject>> {
  const [methodErr, method] = await loadMethodConfig(methodId);
  if (methodErr) return returnError(methodErr);

  const [executeErr, results] = await executeMethod(method);
  if (executeErr) return returnError(executeErr);

  return returnSuccess(results);
}

async function loadMethods(): Promise<TupleReturn<MethodsConfig>> {
  const [loadErr, addonConfig] = await loadAddons();
  if (loadErr) return returnError(loadErr);

  const [readErr, methodsConfig] = await readMethods(addonConfig);
  if (readErr) return returnError(readErr);

  const [err, validatedMethodsConfig] = validateMethodsConfig(
    addonConfig,
    methodsConfig
  );
  if (err) return returnError(err);

  return returnSuccess(validatedMethodsConfig);
}

async function executeMethod(
  methodConfig: MethodConfig
): Promise<TupleReturn<ExecuteObject>> {
  const { addons, methods } = methodConfig;
  if (!(methodId in methods)) {
    return returnErrorFromString(
      ExitCodes.METHOD_NOT_FOUND,
      `Unable to find method with ID=${methodId}`
    );
  }

  const [loadErr, method] = await loadMethodConfig(methods[methodId]);
  if (loadErr) return returnError(loadErr);

  return returnSuccess({});
}

async function loadMethodConfig(
  methodPath: string
): Promise<TupleReturn<MethodImport>> {
  return readConfigFile(methodPath);
}

async function readMethods(
  addonConfig: AddonConfig
): Promise<TupleReturn<MethodsConfig>> {
  return returnSuccess({
    methods: {},
  }); // TODO: Make work
}

function validateMethodsConfig(
  addonConfig: AddonConfig,
  methodsConfig: MethodsConfig
): TupleReturn<MethodsConfig> {
  return returnSuccess({
    methods: {},
  }); // TODO: Make work
}
