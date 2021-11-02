import React from 'react';
import { Helmet } from 'react-helmet';

const BASE_URL = 'https://memes.reflexer.finance';

const SEO = ({ image: imgUrl }) => {
  return (
    <Helmet>
      <link rel="icon" href={`${BASE_URL}/images/icon.png?v=2`} />
      <link
        rel="shortcut icon"
        type="image/ico"
        href={`${BASE_URL}/images/icon.png?v=2`}
      />
      <title>RAI Memes World</title>
      {imgUrl ? (
        <link
          rel="image_src"
          href={imgUrl || BASE_URL + '/images/logo-big.png'}
        />
      ) : null}

      <meta
        name="description"
        content="RAI memes with sharing as card option"
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="RAI Memes World" />
      {imgUrl ? (
        <meta
          property="og:image"
          content={imgUrl || BASE_URL + '/images/logo-big.png'}
        />
      ) : null}
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@reflexerfinance" />
      <meta
        property="twitter:description"
        content="RAI memes with sharing as card option"
      />
      {imgUrl ? (
        <meta
          property="twitter:image"
          content={imgUrl || BASE_URL + '/images/logo-big.png'}
        />
      ) : null}

      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-TileImage"
        content={`${BASE_URL}/images/favicon/ms-icon-144x144.png`}
      />
      <meta name="theme-color" content="#ffffff"></meta>
    </Helmet>
  );
};

export default SEO;
