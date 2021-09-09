import { pathExists } from "fs-extra";
import path from "path";
import {
  ExecuteObject,
  MethodId,
  TupleReturn,
  MethodSettings,
  ImportedMethod,
  AddonName,
  MethodName,
} from "../@types";
import { locateAddon, locateAddonsFolder } from "./addon";
import {
  returnError,
  returnErrorFromError,
  returnErrorFromString,
  returnSuccess,
} from "./common";
import { ExitCodes } from "./exitCodes";

export async function executeMethod(
  methodId: string,
  methodSettings: MethodSettings
): Promise<TupleReturn<ExecuteObject>> {
  const [loadErr, method] = await loadMethod(methodId);
  if (loadErr) return returnError(loadErr);

  const [validationErr] = validateMethodSettings(method, methodSettings);
  if (validationErr) return returnError(validationErr);

  const [executionError, results] = await runMethod(method, methodSettings);
  if (executionError) return returnError(executionError);

  return returnSuccess(results);
}

async function runMethod(
  method: ImportedMethod,
  methodSettings: MethodSettings
): Promise<TupleReturn<ExecuteObject>> {
  const { handle } = method;

  try {
    await handle(methodSettings);
  } catch (err) {
    return returnErrorFromError(ExitCodes.METHOD_EXECUTION_ERROR, err as Error);
  }

  return returnSuccess({});
}

function validateMethodSettings(
  method: ImportedMethod,
  methodSettings: MethodSettings
): TupleReturn<null> {
  // TODO: Validate the method settings
  return returnSuccess(null);
}

async function loadMethod(
  methodId: MethodId
): Promise<TupleReturn<ImportedMethod>> {
  const [addonName, methodName] = unserializeMethodId(methodId);

  const [locateErr, methodFile] = await locateMethod(addonName, methodName);
  if (locateErr) return returnError(locateErr);

  const method: ImportedMethod = await import(methodFile);
  return returnSuccess(method);
}

async function locateMethod(
  addonName: AddonName,
  methodName: MethodName
): Promise<TupleReturn<string>> {
  const [locateErr, addonFolder] = await locateAddon(addonName);
  if (locateErr) return returnError(locateErr);

  const methodFile = path.join(addonFolder, `${methodName}.js`);
  if (!(await pathExists(methodFile))) {
    return returnErrorFromString(
      ExitCodes.FILE_NOT_FOUND,
      `Addon is not found: ${addonFolder}`
    );
  }

  return returnSuccess(methodFile);
}

function unserializeMethodId(methodId: MethodId): [AddonName, MethodName] {
  const unserializeRegex = /shortkey:\/\/addon\/(\S+)\/(\S+)\//;
  if (unserializeRegex.test(methodId)) {
    const result = unserializeRegex.exec(methodId);
    if (result) return [result[0] as AddonName, result[1] as MethodName];
  }

  throw new Error(`Given method ID has incorrect formatting ${methodId}`);
}

function serializeMethodId(
  addonName: AddonName,
  methodName: MethodName
): MethodId {
  return `shortkey://addon/${addonName}/${methodName}/`;
}
