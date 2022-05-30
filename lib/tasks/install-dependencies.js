import chalk from "chalk";
import spawn from "cross-spawn";

const install = (root, useYarn, usePnP, verbose) => {
  return new Promise((resolve, reject) => {
    let command;
    let args;

    console.log("Installing packages. This might take a couple of minutes...");

    if (useYarn) {
      command = "yarn";
      args = ["install"];
      if (usePnP) {
        args.push("--enable-pnp");
      }
      args.push("--cwd");
      args.push(root);
    } else {
      command = "npm";
      args = ["install", "--save", "--save-exact", "--loglevel", "error"];
      if (usePnP) {
        console.log(chalk.yellow("NPM doesn't support PnP"));
        console.log(chalk.yellow("Falling back to the regular install"));
        console.log();
      }
    }

    if (verbose) {
      args.push("--verbose");
    }

    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`${command} ${args.join(" ")} existed with code ${code}`)
        );
      } else {
        resolve();
      }
    });
  });
};

export default install
