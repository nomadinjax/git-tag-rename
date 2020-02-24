#!/usr/bin/env node

const Promise = require("bluebird");
const cliArgs = require("command-line-args");
const cmd = require("node-cmd");

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

// CLI syntax: git-tag-rename --src <old_tag> --target <new_tag>
const argConfig = [
  { name: "src", alias: "s", type: String },
  { name: "target", alias: "t", type: Number }
];
const options = cliArgs(argConfig);
const { src, target } = options;

getAsync(`git tag ${target} ${src}`)
  .then(({ stdout }) => {
    console.info(stdout);
    getAsync(`git push --tags`)
      .then(({ stdout }) => {
        console.info(stdout);
        getAsync(`git tag -d ${src}`)
          .then(({ stdout }) => {
            console.info(stdout);
            getAsync(`git push origin :refs/tags/${src}`)
              .then(({ stdout }) => {
                console.info(stdout);
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));
