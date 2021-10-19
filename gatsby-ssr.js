exports.onPreRenderHTML = ({ replaceHeadComponents, getHeadComponents }) => {
  const headComponents = getHeadComponents();
  console.log(headComponents);
  headComponents.forEach((head) => {
    if (head.props && head.props['data-react-helmet']) {
      delete head.props['data-react-helmet'];
    }
  });
  replaceHeadComponents(headComponents);
};
