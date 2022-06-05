import fs from "fs-extra";
import path from "path";
import template from "lodash.template";

const updatePackageJson = (root, appName, portNumber, clone_url) => {
  const file = path.join(root, "package.json");
  return fs.open(file, "r+").then((fd) =>
    fs
      .readFile(fd)
      .then((result) =>
        template(result.toString())({
          project_name: appName,
          version: "0.0.0",
          port_number: portNumber || 6003,
          clone_url: clone_url
        })
      )
      .then(JSON.parse)
      .then((result) =>
        fs.ftruncate(fd).then(
          fs.writeFile(file, JSON.stringify(result, null, 2), {
            encoding: "utf8",
          })
        )
      )
      .then(() => console.log("") || fs.close(fd))
  );
};

export default updatePackageJson
