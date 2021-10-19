import React from 'react';
import { Helmet } from 'react-helmet';
import useMemes from '../hooks/useMemes';
import { key, scramble, decodeValue } from '../utils/helper';

const BASE_URL = 'https://memes.reflexer.finance';

const Layout = ({ children, search }) => {
  const edges = useMemes();

  const initHash = () => {
    let hash = {};
    let dehash = {};
    for (var e = 0; e < key.length; e++) {
      hash[key[e]] = scramble[e];
      dehash[scramble[e]] = key[e];
    }
    return { hash, dehash };
  };
  console.log(initHash());

  const memesArray = edges.map((e) => [
    e.node.memeFile.file.url,
    e.node.memeFile.file.fileName.toLowerCase().split('_').join(''),
  ]);

  const returnData = () => {
    const memes = memesArray;
    return JSON.stringify(memes);
  };

  const getImg = (decodedImg) => {
    return memesArray.find((a) => a[1] === decodedImg);
  };

  const imgUrl = React.useMemo(() => {
    console.log('search', search);
    if (search) {
      const { dehash } = initHash();
      console.log('hash', dehash);
      const u = search.split('?')[1].split('&')[0];
      const hashedImg = u.split('=')[1];
      const decodedImg = decodeValue(hashedImg, dehash);
      console.log('decodedImg', decodedImg);
      return getImg(decodedImg)
        ? 'https:' + getImg(decodedImg)[0] + '?w=200'
        : `${BASE_URL}/images/logo-big.png`;
    }
    return `${BASE_URL}/images/logo-big.png`;
  }, [search, getImg]);

  return (
    <>
      <Helmet>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`${BASE_URL}/images/favicon/apple-icon-57x57.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href={`${BASE_URL}/images/favicon/apple-icon-60x60.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`${BASE_URL}/images/favicon/apple-icon-72x72.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${BASE_URL}/images/favicon/apple-icon-76x76.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`${BASE_URL}/images/favicon/apple-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`${BASE_URL}/images/favicon/apple-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`${BASE_URL}/images/favicon/apple-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`${BASE_URL}/images/favicon/apple-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${BASE_URL}/images/favicon/apple-icon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`${BASE_URL}/images/favicon/android-icon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${BASE_URL}/images/favicon/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`${BASE_URL}/favicon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${BASE_URL}/images/favicon/favicon-16x16.png`}
        />
        <link rel="image_src" href={imgUrl} />
        <meta
          name="description"
          content="RAI memes with sharing as card option"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="RAI Meme World" />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:image:secure_url" content={imgUrl} />
        <meta property="og:type" content="website" />

        <meta property="twitter:card" content={imgUrl} />
        <meta property="twitter:title" content="RAI Meme World" />
        <meta
          property="twitter:description"
          content="RAI memes with sharing as card option"
        />
        <meta property="twitter:image" content={imgUrl} />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content={`${BASE_URL}/images/favicon/ms-icon-144x144.png`}
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
