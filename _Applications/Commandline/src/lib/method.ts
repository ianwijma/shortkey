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
  AddonSettings,
} from "../@types";
import { executeAddon as setupAddon, locateAddonFolder } from "./addon";
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
  const [addonName, methodName] = unserializeMethodId(methodId);

  const [addonSetupErr, [addonSettings]] = await setupAddon(addonName);
  if (addonSetupErr) return returnError(addonSetupErr);

  const [loadErr, method] = await loadMethod(addonName, methodName);
  if (loadErr) return returnError(loadErr);

  const [methodExecErr, results] = await runMethod(
    method,
    addonSettings,
    methodSettings
  );
  if (methodExecErr) return returnError(methodExecErr);

  return returnSuccess(results);
}

async function runMethod(
  method: ImportedMethod,
  addonSettings: AddonSettings,
  methodSettings: MethodSettings
): Promise<TupleReturn<ExecuteObject>> {
  const { handle } = method;

  try {
    await handle(addonSettings, methodSettings);
  } catch (err) {
    return returnErrorFromError(ExitCodes.METHOD_EXECUTION_ERROR, err as Error);
  }

  return returnSuccess({});
}

async function loadMethod(
  addonName: AddonName,
  methodName: MethodName
): Promise<TupleReturn<ImportedMethod>> {
  const [locateErr, methodFile] = await locateMethod(addonName, methodName);
  if (locateErr) return returnError(locateErr);

  const method: ImportedMethod = await import(methodFile);
  return returnSuccess(method);
}

async function locateMethod(
  addonName: AddonName,
  methodName: MethodName
): Promise<TupleReturn<string>> {
  const [locateErr, addonFolder] = await locateAddonFolder(addonName);
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
