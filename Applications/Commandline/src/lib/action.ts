import path from "path/posix";
import { ActionConfig, ActionId, ExecuteObject, TupleReturn } from "../@types";
import { returnError, returnErrorFromString, returnSuccess } from "./common";
import { locateConfigFolder, readConfigFile } from "./config";
import { ACTION_FOLDER } from "./paths";
import { pathExists } from "fs-extra";
import { ExitCodes } from "./exitCodes";

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

  const [readErr, actionConfig] = await readConfigFile(1, actionConfigFile, {});
  if (readErr) return returnError(readErr);

  return returnSuccess(actionConfig);
}

async function executeAction(
  actionConfig: ActionConfig
): Promise<TupleReturn<ExecuteObject>> {
  const [locateErr];

  return returnSuccess({});
}

async function locateActionsFolder() {
  const [locateErr, configFolder] = await locateConfigFolder();
  if (locateErr) return returnError(locateErr);

  const actionsFolder = path.join(configFolder, ACTION_FOLDER);
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
  const [locateErr, actionsFolder] = await locateActionsFolder();
  if (locateErr) return returnError(locateErr);

  const actionConfigFile = path.join(actionsFolder, `${actionId}.yaml`);
  if (!(await pathExists(actionConfigFile)))
    return returnErrorFromString(
      ExitCodes.FOLDER_NOT_FOUND,
      `Action folder does not found: ${actionConfigFile}`
    );

  return returnSuccess(actionConfigFile);
}
