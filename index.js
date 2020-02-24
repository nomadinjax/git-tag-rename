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
console.info(options);
const { src, target } = options;
console.info('src', src);
console.info('target', target);

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
