#!/usr/bin/env node

const Promise = require("bluebird");
const cmd = require("node-cmd");

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

// CLI syntax: git-tag-rename <old_tag> <new_tag>
const old_tag = $1;
const new_tag = $2;

getAsync(`git tag ${new_tag} ${old_tag}`)
  .then(({ stdout }) => {
    console.info(stdout);
    getAsync(`git push --tags`)
      .then(({ stdout }) => {
        console.info(stdout);
        getAsync(`git tag -d ${old_tag}`)
          .then(({ stdout }) => {
            console.info(stdout);
            getAsync(`git push origin :refs/tags/${old_tag}`)
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
