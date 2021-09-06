#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import logger from "./utils/logging";

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir("cmd")
  // Enable strict mode.
  .strict()
  // Add verbosity
  .count("verbose")
  // Useful aliases.
  .alias("h", "help")
  .alias("v", "verbose").argv;
