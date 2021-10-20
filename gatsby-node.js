const path = require('path');

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
