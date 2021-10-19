import * as React from 'react';
import { makeFB, makeTw, openURLInPopup } from '../utils/helper';
import Layout from '../components/Layout';

const SharePage = ({ location: { search } }) => {
  return (
    <Layout search={search}>
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
            onClick={() =>
              openURLInPopup(
                makeFB('https://mstfash.github.io/rai-memes', 600, 400)
              )
            }
          >
            <img src="/images/facebook.svg" alt="" />
          </button>
          <button
            className="iconButton pointer"
            onClick={() =>
              openURLInPopup(
                makeTw(
                  'Enjoy RAI Memes World',
                  'RAI_Memes_World',
                  'https://mstfash.github.io/rai-memes'
                )
              )
            }
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
                      openURLInPopup(
                        makeFB('https://mstfash.github.io/rai-memes', 600, 400)
                      )
                    }
                  >
                    <img src="/images/facebook.svg" alt="" />
                  </button>
                  <button
                    className="iconButton iconButton--solid pointer"
                    onClick={() =>
                      openURLInPopup(
                        makeTw(
                          'Enjoy RAI Memes World',
                          'RAI_Memes_World',
                          'https://mstfash.github.io/rai-memes'
                        )
                      )
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
