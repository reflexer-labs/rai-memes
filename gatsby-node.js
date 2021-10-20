const path = require('path');

const key = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ';
const scramble =
  '5DphrLu1HVIW PoCcjX64ES9q8laQTyktJAnBRx2i7gUbvsOm3wZK0fzNeMYFdG';

function initHash() {
  let hash = {};
  let dehash = {};
  for (var e = 0; e < key.length; e++) {
    hash[key[e]] = scramble[e];
    dehash[scramble[e]] = key[e];
  }
  return { hash, dehash };
}

function encodeValue(e) {
  const { hash } = initHash();
  let t = '';
  for (let r = 0; r < e.length; r++) {
    var n = hash[e[r]];
    null == n && (n = e[r]);
    t += n;
  }
  return (t = t.split(' ').join('_')), (t = encodeURIComponent(t));
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const shareTemplate = path.resolve('src/templates/share.js');

  const shares = new Promise((resolve, reject) => {
    resolve(
      graphql(`
        query {
          allContentfulMeme {
            edges {
              node {
                id
                memeFile {
                  file {
                    fileName
                    url
                  }
                }
              }
            }
          }
        }
      `).then((result) => {
        if (result.errors) {
          reject(result.errors);
        }

        result.data.allContentfulMeme.edges.forEach((edge) => {
          // const encodedImg = encodeValue(edge.node.memeFile.file.fileName);
          createPage({
            path: `/share/`,
            component: shareTemplate,
            context: {},
          });
        });
        return;
      })
    );
  });

  return shares;
};
