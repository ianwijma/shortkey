import path from "path/posix";
import {
  ActionConfig,
  ActionId,
  ActionStepId,
  ActionSteps,
  ErrorObject,
  ExecuteObject,
  TupleReturn,
} from "../@types";
import { returnError, returnErrorFromString, returnSuccess } from "./common";
import { locateConfigFolder, readConfigFile } from "./config";
import { ACTIONS_FOLDER } from "./paths";
import { pathExists } from "fs-extra";
import { ExitCodes } from "./exitCodes";
import { executeMethod } from "./method";

export async function runAction(
  actionId: ActionId
): Promise<TupleReturn<ExecuteObject>> {
  const [loadErr, actionConfig] = await loadAction(actionId);
  if (loadErr) return returnError(loadErr);

  const [executeErr, results] = await executeAction(actionConfig);
  if (executeErr) return returnError(executeErr);

  return returnSuccess(results);
}

async function loadAction(
  actionId: ActionId
): Promise<TupleReturn<ActionConfig>> {
  const [locateErr, actionConfigFile] = await locateActionConfigFile(actionId);
  if (locateErr) return returnError(locateErr);

  const [readErr, actionConfig] = await readConfigFile(actionConfigFile, {}, 1);
  if (readErr) return returnError(readErr);

  return returnSuccess(actionConfig);
}

async function executeAction(
  actionConfig: ActionConfig
): Promise<TupleReturn<ExecuteObject>> {
  const { firstActionStepIds: firstStepIds, actionSteps: steps } = actionConfig;

  const [execErr, execRes] = await executeActionSteps(steps, firstStepIds);
  if (execErr) return returnError(execErr);

  return returnSuccess(execRes);
}

async function executeActionSteps(
  actionStepMap: ActionSteps,
  actionStepIds: ActionStepId[],
  results: ExecuteObject = { stepExecutions: 0, warnings: [] }
): Promise<TupleReturn<ExecuteObject>> {
  let errorObj: ErrorObject | null = null;
  let nextStepId = actionStepIds.shift();

  const mergeResults = (newResults: ExecuteObject) => {
    if (newResults.warnings) {
      results.warnings = (results.warnings ?? []).concat(newResults.warnings);
    }
  };

  while (!errorObj && nextStepId) {
    const [execErr, execRes] = await executeActionStep(
      actionStepMap,
      nextStepId
    );

    if (execErr) {
      errorObj = execErr;
    } else {
      mergeResults(execRes);
      nextStepId = actionStepIds.shift();
    }
  }

  if (errorObj) return returnError(errorObj);
  return returnSuccess(results);
}

async function executeActionStep(
  actionStepMap: ActionSteps,
  actionStepId: ActionStepId
): Promise<TupleReturn<ExecuteObject>> {
  if (actionStepId in actionStepMap) {
    const { methodId, methodSettings } = actionStepMap[actionStepId];
    const [execErr, execRes] = await executeMethod(methodId, methodSettings);
    if (execErr) return returnError(execErr);

    return returnSuccess(execRes);
  } else {
    throw new Error(`Unknown step with id "${actionStepId}"`);
  }
}

async function locateActionsFolder() {
  const [locateErr, configFolder] = await locateConfigFolder();
  if (locateErr) return returnError(locateErr);

  const actionsFolder = path.join(configFolder, ACTIONS_FOLDER);
  if (!(await pathExists(actionsFolder)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `Actions folder does not found: ${actionsFolder}`
    );

  return returnSuccess(actionsFolder);
}

async function locateActionConfigFile(
  actionId: ActionId
): Promise<TupleReturn<string>> {
  const [pathErr, actionConfigFile] = await getActionConfigFilePath(actionId);
  if (pathErr) return returnError(pathErr);

  if (!(await pathExists(actionConfigFile)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `Action folder does not found: ${actionConfigFile}`
    );

  return returnSuccess(actionConfigFile);
}

async function getActionConfigFilePath(
  actionId: ActionId
): Promise<TupleReturn<string>> {
  const [locateErr, actionsFolder] = await locateActionsFolder();
  if (locateErr) return returnError(locateErr);

  const configPath = path.join(actionsFolder, `${actionId}.yaml`);
  return returnSuccess(configPath);
}
