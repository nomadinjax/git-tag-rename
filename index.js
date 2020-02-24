#!/usr/bin/env node

const Promise = require("bluebird");
const cliArgs = require("command-line-args");
const cmd = require("node-cmd");

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

// CLI syntax: git-tag-rename --src <old_tag> --target <new_tag>
const argConfig = [
  { name: "src", alias: "s", type: String },
  { name: "target", alias: "t", type: String }
];
const options = cliArgs(argConfig);
const { src, target } = options;

getAsync(`git tag ${target} ${src}`)
  .then((result1) => {
    console.info(result1);
    getAsync(`git push --tags`)
      .then((result2) => {
        console.info(result2);
        getAsync(`git tag -d ${src}`)
          .then((result3) => {
            console.info(result3);
            getAsync(`git push origin :refs/tags/${src}`)
              .then((result4) => {
                console.info(result4);
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));
