import * as React from 'react';
import Layout from '../components/Layout';
import { makeFB, makeTw } from '../utils/helper';

const IndexPage = () => {
  return (
    <Layout>
      <nav />
      <div id="snow"></div>
      <div className="boiler">
        <a href="/" className="boiler__title svg pointer">
          <img alt="" className="boiler__desktop" src="images/nav-logo.png" />
          <img alt="" className="boiler__mobile" src="images/logo-mobile.png" />
        </a>

        <div className="boiler__share">
          <span>Share</span>
          <button
            className="iconButton pointer"
            onClick={() =>
              makeFB('https://mstfash.github.io/rai-memes', 600, 400)
            }
          >
            <img alt="" src="images/facebook.svg" />
          </button>
          <button
            className="iconButton pointer"
            onClick={() =>
              makeTw(
                'Enjoy RAI Memes World',
                'RAI Memes World',
                'https://mstfash.github.io/rai-memes'
              )
            }
          >
            <img alt="" src="images/twitter.svg" />
          </button>
        </div>

        <div className="boiler__options pointer">
          <span id="mute" className="boiler__mute">
            <img alt="" src="images/music.svg" />
          </span>
        </div>
      </div>

      <div className="preload" id="preload">
        <div className="preload__bg"></div>

        <div className="preload__content">
          <div className="svg preload__logo fadeUp sa--delay3">
            <img alt="" src="images/logo-big.png" />
          </div>

          <p className="preload__paragraph fadeUp sa--delay4">
            Share some RAI spirit with these historical
            <br /> and explanatory RAI Memes. Laugh, love, <br />
            and have an enjoyable journey!
          </p>

          <div className="preload__loader fadeUp sa--delay5">
            <div className="preload__progress"></div>
            <span className="preload__button button pointer" id="start-site">
              Start RAI Memes Journey
            </span>
          </div>
        </div>
      </div>

      <div className="grid__line"></div>

      <div className="grid" id="grid"></div>

      <div className="grid__intro" id="grid-intro">
        <div className="grid__introBg"></div>
        <div className="grid__introMessage">
          <div className="grid__introAnimation"></div>
          <span>
            Drag to Explore 
            <br /> Tap to Expand
          </span>
        </div>
      </div>

      <div className="grid__overlay" id="grid-overlay">
        <span className="grid__close pointer" id="grid-close">
          <img alt="" src="images/close_white.svg" />
        </span>

        <div className="grid__count">
          <div className="grid__countCurrent">
            <span id="grid-current">01</span>
          </div>
          <div className="grid__countDivider"></div>
          <div className="grid__countTotal">
            <span id="grid-total">32</span>
          </div>
        </div>

        <div className="grid__nav">
          <div className="grid__navUp pointer">
            <span className="iconButton iconButton--large" id="grid-up">
              <img alt="" src="images/up-arrow.svg" />
            </span>
          </div>
          <div className="grid__navDown pointer">
            <span className="iconButton iconButton--large" id="grid-down">
              <img alt="" src="images/down-arrow.svg" />
            </span>
          </div>
        </div>

        <div className="grid__cta">
          <div className="circleButton perfect" id="grid-cta">
            <div className="circleButton__bg"></div>
            <span className="circleButton__text">
              <span className="circleButton__line sa maskOut">
                <span data-sa-stagger="circle">Write A </span>
              </span>
              <span className="circleButton__line sa maskOut">
                <span data-sa-stagger="circle">Message </span>
              </span>
              <span className="circleButton__line sa maskOut">
                <span data-sa-stagger="circle">& Share </span>
              </span>
              <span className="circleButton__line sa maskOut">
                <span data-sa-stagger="circle"> This Meme</span>
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="detail" id="detail-template">
        <div className="detail__form">
          <div className="detail__inputGroup fadeUp" data-sa-stagger="detail">
            <div className="detail__labelWrap">
              <div className="detail__label" for="t">
                Title
              </div>
              <span className="detail__letterCount">
                <span className="count" data-max="40">
                  0
                </span>{' '}
                / 40
              </span>
            </div>
            <input className="detail__input" name="t" />
          </div>

          <div className="detail__inputGroup fadeUp" data-sa-stagger="detail">
            <div className="detail__labelWrap">
              <div className="detail__label" for="m">
                Message
              </div>
              <span className="detail__letterCount">
                <span className="count" data-max="200">
                  0
                </span>{' '}
                / 200
              </span>
            </div>
            <textarea
              className="detail__input"
              rows="1"
              name="m"
              oninput="auto_grow(this)"
            ></textarea>
          </div>

          <div className="detail__inputGroup fadeUp" data-sa-stagger="detail">
            <div className="detail__labelWrap">
              <div className="detail__label" for="f">
                From
              </div>
              <span className="detail__letterCount">
                <span className="count" data-max="40">
                  0
                </span>{' '}
                / 40
              </span>
            </div>
            <input className="detail__input" name="f" />
          </div>
        </div>

        <div className="detail__bottom fadeUp" data-sa-stagger="detail">
          <span className="detail__subheading">Share this meme!</span>
          <div className="detail__buttons">
            <span className="iconButton iconButton--solid pointer facebookButton">
              <img alt="" src="images/facebook.svg" />
            </span>
            <span className="iconButton iconButton--solid pointer twitterButton">
              <img alt="" src="images/twitter.svg" />
            </span>
          </div>
          <div className="detail__bottomButtons">
            <div className="detail__bottomLeft">
              <span className="detail__button button button--green previewButton pointer">
                Preview
              </span>
            </div>
            <div className="detail__bottomRight">
              <span className="detail__button button copyButton pointer">
                Copy Link
              </span>
            </div>
          </div>
        </div>
      </div>

      <div id="cover"></div>
    </Layout>
  );
};

export default IndexPage;
