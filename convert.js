/*
 * File: convert china address data
 * Author: jakexchan
 */

const fs = require('fs');
const cmder = require('commander');
const package = require('./package.json');

cmder
  .version(package.version)
  .option('-s, --source <path>', 'Data source')
  .option('-o, --output <path>', 'Output')
  .parse(process.argv);

main();

function main () {
  fs.readFile(cmder.source, 'utf-8', (err, data) => {
    if (err) {
      throw new Error(err);
    }
  
    let address = JSON.parse(data);
  
    let result = treeToList(convertToTree(address));
  
    fs.writeFile(cmder.output, JSON.stringify(result, null, 2), 'utf-8', (err, data) => {
      if (err) {
        throw new Error(err);
      }
      console.log('Convert success!');
    })
  });
}

/**
 * List to tree
 *
 * @param {array} data
 * @returns {object}
 */
function convertToTree (data) {
  let obj = {};
  for (let i = 0; i < data.length; i++) {
    let current = data[i];
    if (typeof current.parent === 'undefined') {
      obj[current.value] = {
        value: current.value,
        label: current.name,
        children: {}
      }
    } else {
      if (obj[current.parent]) {
        obj[current.parent].children[current.value] = {
          value: current.value,
          label: current.name,
          children: {}
        }
      } else {
        for (let key in obj) {
          if (obj[key].children[current.parent]) {
            obj[key].children[current.parent].children[current.value] = {
              value: current.value,
              label: current.name
            }
          }
        }
      }
    }
  }

  return obj;
}

/**
 * Tree to list
 *
 * @param {object} data
 * @returns
 */
function treeToList (data) {
  let array = [];

  for (let key in data) {
    if (data[key].children) {
      data[key].children = treeToList(data[key].children);
    }
    array.push(data[key]);
  }
  return array;
}
