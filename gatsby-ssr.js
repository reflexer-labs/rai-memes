const _ = require('lodash');

// cleanup html before render
exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents();
  replaceHeadComponents(omitDeep(headComponents, ['data-react-helmet']));
};

const omitDeep = (collection, excludeKeys) =>
  _.cloneDeepWith(collection, (value) => {
    if (value && typeof value === 'object') {
      for (const key of excludeKeys) {
        try {
          delete value[key];
        } catch (_) {
          // console.log("ignore", _);
        }
      }
    }
  });
