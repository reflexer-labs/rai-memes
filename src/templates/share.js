import * as React from 'react';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import useMemes from '../hooks/useMemes';
import { decodeValue } from '../utils/helper';

const SharePage = ({ location: { search } }) => {
  const edges = useMemes();

  const memesArray = edges.map((e) => [
    e.node.memeFile.file.url,
    e.node.memeFile.file.fileName.toLowerCase().split('_').join(''),
  ]);

  const getImg = React.useCallback(
    (decodedImg) => {
      return memesArray.find((a) => a[1] === decodedImg);
    },
    [memesArray]
  );
  const imgUrl = React.useMemo(() => {
    if (!search) return '';
    const u = search.split('?')[1].split('&')[0];
    const hashedImg = u.split('=')[1];
    const decodedImg = decodeValue(hashedImg);
    return getImg(decodedImg) && 'https:' + getImg(decodedImg)[0] + '?w=500';
  }, [search, getImg]);

  console.log('imgUrl inner seo', imgUrl);

  return (
    <Layout>
      <Seo image={imgUrl} />
      <nav></nav>
      <div id="snow"></div>
      <div className="boiler">
        <a href="/" className="boiler__title svg pointer">
          <img alt="" className="boiler__desktop" src="/images/nav-logo.png" />
          <img
            alt=""
            className="boiler__mobile"
            src="/images/logo-mobile.png"
          />
        </a>

        <div className="boiler__share">
          <span>Share</span>
          <button
            className="iconButton pointer"
            onClick={() => window['shareController'].socialLink('facebook')}
          >
            <img src="/images/facebook.svg" alt="" />
          </button>
          <button
            className="iconButton pointer"
            onClick={() => window['shareController'].socialLink('twitter')}
          >
            <img src="/images/twitter.svg" alt="" />
          </button>
        </div>

        <div className="boiler__options pointer">
          <span id="mute" className="boiler__mute">
            <img src="/images/music.svg" alt="" />
          </span>
        </div>
      </div>
      <div className="share" id="share">
        <div className="share__card">
          <div className="share__cover" id="share-image"></div>
          <div className="share__inner" id="share-inner">
            <div className="share__content">
              <p
                className="share__subheading fadeUp"
                data-sa-stagger="share"
                data-sa-stagger-speed="200"
              >
                I am Stable and you know it!
              </p>
              <h2
                className="share__title fadeUp"
                data-sa-stagger="share"
                data-sa-stagger-speed="200"
                id="share-title"
              >
                {' '}
              </h2>
              <p
                className="share__message fadeUp"
                data-sa-stagger="share"
                data-sa-stagger-speed="500"
                id="share-message"
              ></p>
              <p
                className="share__from fadeUp"
                data-sa-stagger="share"
                data-sa-stagger-speed="700"
                id="share-from"
              ></p>
            </div>

            <div
              className="share__bottom fade"
              data-sa-stagger="share"
              data-sa-stagger-speed="700"
            >
              <div className="share__bottomLeft">
                <span className="">Share Meme!</span>
                <div className="share__buttons">
                  <button
                    className="iconButton iconButton--solid pointer"
                    onClick={() =>
                      window['shareController'].socialLink('facebook')
                    }
                  >
                    <img src="/images/facebook.svg" alt="" />
                  </button>
                  <button
                    className="iconButton iconButton--solid pointer"
                    onClick={() =>
                      window['shareController'].socialLink('twitter')
                    }
                  >
                    <img src="/images/twitter.svg" alt="" />
                  </button>
                </div>
              </div>
              <div className="share__bottomRight">
                <a href="/" className="share__button button pointer">
                  View Memes
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="share__cta" id="share-open">
          <div className="circleButton pointer" id="grid-cta">
            <div className="circleButton__bg"></div>
            <span className="circleButton__text">
              <span className="circleButton__line maskOut">
                <span>Open</span>
              </span>
              <span className="circleButton__line maskOut">
                <span>RAI</span>
              </span>
              <span className="circleButton__line maskOut">
                <span>Meme !</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div id="cover"></div>
    </Layout>
  );
};

export default SharePage;
