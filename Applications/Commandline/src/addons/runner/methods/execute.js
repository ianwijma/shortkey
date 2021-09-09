import { exec } from "child_process";

export const name = "Execute";
export const description = "Executes a command or program";
export const settings = {
  command: {
    name: "Command",
    description: "The command to execute",
    type: "string",
  },
};
export async function handle(addonSettings, methodSettings) {
  const { environmentVariables = {} } = addonSettings;
  const { command } = methodSettings;

  const env = Object.keys(environmentVariables).reduce((acc, key) => {
    const value = environmentVariables[key];
    return (acc += ` ${key}=${value}`);
  });

  exec(`${env} ${command}`);
}
