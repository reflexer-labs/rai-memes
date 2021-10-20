import React from 'react';
import useMemes from '../hooks/useMemes';

const Layout = ({ children }) => {
  const edges = useMemes();

  const memesArray = edges.map((e) => [
    e.node.memeFile.file.url,
    e.node.memeFile.file.fileName.toLowerCase().split('_').join(''),
  ]);

  const returnData = () => {
    const memes = memesArray;
    return JSON.stringify(memes);
  };

  return (
    <>
      <div id="cards-blockie" style={{ display: 'none' }}>
        {returnData()}
      </div>
      {children}
    </>
  );
};

export default Layout;
