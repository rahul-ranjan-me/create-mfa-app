import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { templates } from "../const.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyFiles = (root, mfeType) => {
  const templateNameInput = templates[mfeType].name;
  const src = path.join(
    __dirname,
    "../../templates",
    templateNameInput || "mfe-app"
  );
  return fs
    .copy(src, root, { overwrite: false })
    .then(() => console.log(`Project files copied to ${chalk.green(root)}.`));
};

export default copyFiles
