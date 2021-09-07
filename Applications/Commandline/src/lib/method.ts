import {
  AddonConfig,
  ExecuteObject,
  MethodConfig,
  MethodId,
  TupleReturn,
} from "../@types";
import loadAddons from "./addon";
import { returnError, returnSuccess } from "./common";

export async function runMethod(
  methodId: MethodId
): Promise<TupleReturn<ExecuteObject>> {
  const [loadErr, methodConfig] = await loadMethods();
  if (loadErr) return returnError(loadErr);

  const [executeErr, results] = await executeMethod(methodId, methodConfig);
  if (executeErr) return returnError(executeErr);

  return returnSuccess(results);
}

async function loadMethods(): Promise<TupleReturn<MethodConfig>> {
  const [loadErr, addonConfig] = await loadAddons();
  if (loadErr) return returnError(loadErr);

  const [readErr, methodConfig] = await readMethods(addonConfig);
  if (readErr) return returnError(readErr);

  const [err, validatedMethodConfig] = validateMethodConfig(
    addonConfig,
    methodConfig
  );
  if (err) return returnError(err);

  return returnSuccess(validatedMethodConfig);
}

async function executeMethod(
  methodId: MethodId,
  methodConfig: MethodConfig
): Promise<TupleReturn<ExecuteObject>> {
  const obj: ExecuteObject = {};
  return returnSuccess(obj);
}

async function readMethods(
  addonConfig: AddonConfig
): Promise<TupleReturn<MethodConfig>> {
  const obj: MethodConfig = {
    methods: [],
  };
  return returnSuccess(obj); // TODO: Make work
}

function validateMethodConfig(
  addonConfig: AddonConfig,
  methodConfig: MethodConfig
): TupleReturn<MethodConfig> {
  const obj: MethodConfig = {
    methods: [],
  };
  return returnSuccess(obj); // TODO: Make work
}
