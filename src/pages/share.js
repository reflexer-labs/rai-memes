import * as React from 'react';
import { makeFB, makeTw } from '.';
import Layout from '../components/Layout';

const sharePage = () => {
  return (
    <Layout>
      <nav></nav>
      <div id="snow"></div>
      <div className="boiler">
        <a href="/" className="boiler__title svg pointer">
          <img className="boiler__desktop" src="images/nav-logo.svg" />
          <img className="boiler__mobile" src="images/logo-mobile.svg" />
        </a>

        <div className="boiler__share">
          <span>Share</span>
          <a className="iconButton pointer" onClick={() => {}}>
            <img src="images/facebook.svg" />
          </a>
          <a className="iconButton pointer" onClick={() => {}}>
            <img src="images/twitter.svg" />
          </a>
        </div>

        <div className="boiler__options pointer">
          <span id="mute" className="boiler__mute">
            <img src="images/music.svg" />
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
              ></h2>
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
                  <a
                    className="iconButton iconButton--solid pointer"
                    onClick={() =>
                      makeFB('https://mstfash.github.io/rai-memes', 600, 400)
                    }
                  >
                    <img src="images/facebook.svg" />
                  </a>
                  <a
                    className="iconButton iconButton--solid pointer"
                    onClick={() =>
                      makeTw(
                        'Enjoy RAI Memes World',
                        'RAI Memes World',
                        'https://mstfash.github.io/rai-memes'
                      )
                    }
                  >
                    <img src="images/twitter.svg" />
                  </a>
                </div>
              </div>
              <div className="share__bottomRight">
                <a href="/rai-memes" className="share__button button pointer">
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

export default sharePage;
