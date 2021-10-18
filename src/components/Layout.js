import React from 'react';
import { Helmet } from 'react-helmet';
import useMemes from '../hooks/useMemes';

const Layout = ({ children }) => {
  const edges = useMemes();
  const returnData = () => {
    const memes = edges.map((e) => [
      e.node.memeFile.file.url,
      e.node.memeFile.file.fileName.toLowerCase().split('_').join(''),
    ]);
    return JSON.stringify(memes);
  };

  return (
    <>
      <Helmet>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="images/favicon/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="images/favicon/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="images/favicon/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="images/favicon/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="images/favicon/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="images/favicon/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="images/favicon/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="images/favicon/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="images/favicon/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="images/favicon/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="images/favicon/favicon-16x16.png"
        />
        <meta
          name="description"
          content="RAI memes with sharing as card option"
        />
        <meta property="title" content="RAI Meme World" />
        <meta property="og:title" content="RAI Meme World" />
        <meta property="og:type" content="website" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="images/favicon/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff"></meta>
      </Helmet>
      <div id="cards-blockie" style={{ display: 'none' }}>
        {returnData()}
      </div>
      {children}
    </>
  );
};

export default Layout;
