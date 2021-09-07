import { AddonConfig, TupleReturn } from "../@types";
import { returnSuccess } from "./common";

export default async function loadAddons(): Promise<TupleReturn<AddonConfig>> {
  const add: AddonConfig = {
    addons: [],
  };
  return returnSuccess(add);
}
