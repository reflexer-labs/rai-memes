function _toConsumableArray(e) {
  return _arrayWithoutHoles(e) || _iterableToArray(e) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError('Invalid attempt to spread non-iterable instance');
}
function _iterableToArray(e) {
  if (
    Symbol.iterator in Object(e) ||
    '[object Arguments]' === Object.prototype.toString.call(e)
  )
    return Array.from(e);
}
function _arrayWithoutHoles(e) {
  if (Array.isArray(e)) {
    for (var t = 0, r = new Array(e.length); t < e.length; t++) r[t] = e[t];
    return r;
  }
}
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError('Cannot call a class as a function');
}
function _defineProperties(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    (n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      'value' in n && (n.writable = !0),
      Object.defineProperty(e, n.key, n);
  }
}
function _createClass(e, t, r) {
  return (
    t && _defineProperties(e.prototype, t), r && _defineProperties(e, r), e
  );
}
var animUtil = {
    queue: [],
    i: 0,
    init: function () {
      browserController.addToRenderLoop(animUtil.render);
    },
    runAnimation: function (e, t, r, n) {
      var o = {
        callback: e,
        duration: t,
        easing: r,
        then: n,
        t: 0,
        p: 0,
        end: function () {
          animUtil.finish(this);
        },
        finished: !1,
      };
      return animUtil.queue.push(o), o;
    },
    render: function () {
      for (animUtil.i = 0; animUtil.i < animUtil.queue.length; animUtil.i++)
        animUtil.run(animUtil.queue[animUtil.i]);
    },
    run: function (e) {
      (e.t += browserController.state.delta),
        (e.p = Math.min(1, e.t / e.duration)),
        e.callback(e.easing ? e.easing(e.p) : e.p),
        1 <= e.p && animUtil.finish(e);
    },
    finish: function (e) {
      e.then && e.then(),
        (e.finished = !0),
        animUtil.queue.splice(animUtil.queue.indexOf(e), 1),
        animUtil.i--;
    },
  },
  NEWTON_ITERATIONS = 4,
  NEWTON_MIN_SLOPE = 0.001,
  SUBDIVISION_PRECISION = 1e-7,
  SUBDIVISION_MAX_ITERATIONS = 10,
  kSplineTableSize = 11,
  kSampleStepSize = 1 / (kSplineTableSize - 1),
  float32ArraySupported = 'function' == typeof Float32Array;
function A(e, t) {
  return 1 - 3 * t + 3 * e;
}
function B(e, t) {
  return 3 * t - 6 * e;
}
function C(e) {
  return 3 * e;
}
function calcBezier(e, t, r) {
  return ((A(t, r) * e + B(t, r)) * e + C(t)) * e;
}
function getSlope(e, t, r) {
  return 3 * A(t, r) * e * e + 2 * B(t, r) * e + C(t);
}
function binarySubdivide(e, t, r, n, o) {
  for (
    var i, a, l = 0;
    0 < (i = calcBezier((a = t + (r - t) / 2), n, o) - e) ? (r = a) : (t = a),
      Math.abs(i) > SUBDIVISION_PRECISION && ++l < SUBDIVISION_MAX_ITERATIONS;

  );
  return a;
}
function newtonRaphsonIterate(e, t, r, n) {
  for (var o = 0; o < NEWTON_ITERATIONS; ++o) {
    var i = getSlope(t, r, n);
    if (0 === i) return t;
    t -= (calcBezier(t, r, n) - e) / i;
  }
  return t;
}
function LinearEasing(e) {
  return e;
}
function bezier(a, t, l, r) {
  if (!(0 <= a && a <= 1 && 0 <= l && l <= 1))
    throw new Error('bezier x values must be in [0, 1] range');
  if (a === t && l === r) return LinearEasing;
  for (
    var s = float32ArraySupported
        ? new Float32Array(kSplineTableSize)
        : new Array(kSplineTableSize),
      e = 0;
    e < kSplineTableSize;
    ++e
  )
    s[e] = calcBezier(e * kSampleStepSize, a, l);
  return function (e) {
    return 0 === e
      ? 0
      : 1 === e
      ? 1
      : calcBezier(
          (function (e) {
            for (
              var t = 0, r = 1, n = kSplineTableSize - 1;
              r !== n && s[r] <= e;
              ++r
            )
              t += kSampleStepSize;
            var o = t + ((e - s[--r]) / (s[r + 1] - s[r])) * kSampleStepSize,
              i = getSlope(o, a, l);
            return NEWTON_MIN_SLOPE <= i
              ? newtonRaphsonIterate(e, o, a, l)
              : 0 === i
              ? o
              : binarySubdivide(e, t, t + kSampleStepSize, a, l);
          })(e),
          t,
          r
        );
  };
}
var dpi = Math.min(2, window.devicePixelRatio),
  mouse = { x: 0, y: 0, down: !1 };
function initBrowser() {
  window.addEventListener('scroll', function () {}),
    window.addEventListener('mousemove', function () {}),
    window.addEventListener('mousedown', function () {}),
    window.addEventListener('mouseup', function () {}),
    window.addEventListener('touchstart', function () {}),
    window.addEventListener('touchmove', function () {}),
    window.addEventListener('touchend', function () {});
}
var browserController = {
    state: {
      scrollTop: 0,
      toRender: [],
      toResize: [],
      resizeTimeout: null,
      mouse: {
        x: 0,
        y: 0,
        xLag: 0,
        yLag: 0,
        lag: 3,
        xLagSlow: 0,
        yLagSlow: 0,
        slowLag: 20,
        down: !1,
      },
      dpi: window.devicePixelRatio || 1,
      t: 0,
      d: Date.now(),
      delta: 0,
      rem: 0,
      isMobile: window.innerWidth < 800,
      isPortrait: window.innerHeight > window.innerWidth,
    },
    initialize: function () {
      browserController.resizeBaseWork(),
        window.addEventListener('scroll', browserController.onScroll),
        window.addEventListener('mousemove', browserController.onMouseMove),
        window.addEventListener('mousedown', browserController.onMouseDown),
        window.addEventListener('mouseup', browserController.onMouseUp),
        window.addEventListener('mouseout', function (e) {
          var t = (e = e || window.event).relatedTarget || e.toElement;
          (t && 'HTML' != t.nodeName) || browserController.onMouseUp();
        }),
        window.addEventListener('resize', browserController.onResize),
        browserController.renderLoop();
    },
    onScroll: function () {
      browserController.state.scrollTop = browserController.getScroll();
    },
    getScroll: function () {
      return window.pageYOffset || document.documentElement.scrollTop;
    },
    onMouseMove: function (e) {
      (browserController.state.mouse.x = e.clientX),
        (browserController.state.mouse.y = e.clientY);
    },
    onMouseDown: function () {
      (browserController.state.mouse.down = !0), ads('mousedown');
    },
    onMouseUp: function () {
      (browserController.state.mouse.down = !1), rds('mousedown');
    },
    addToRenderLoop: function (e) {
      browserController.state.toRender.push(e);
    },
    renderBaseWork: function () {
      (browserController.state.delta = Date.now() - browserController.state.d),
        (browserController.state.t += browserController.state.delta),
        (browserController.state.d = Date.now()),
        (browserController.state.mouse.xLag +=
          (browserController.state.mouse.x -
            browserController.state.mouse.xLag) /
          browserController.state.mouse.lag),
        (browserController.state.mouse.yLag +=
          (browserController.state.mouse.y -
            browserController.state.mouse.yLag) /
          browserController.state.mouse.lag),
        (browserController.state.mouse.xLagSlow +=
          (browserController.state.mouse.x -
            browserController.state.mouse.xLagSlow) /
          browserController.state.mouse.slowLag),
        (browserController.state.mouse.yLagSlow +=
          (browserController.state.mouse.y -
            browserController.state.mouse.yLagSlow) /
          browserController.state.mouse.slowLag);
    },
    renderLoop: function () {
      browserController.renderBaseWork(),
        browserController.state.toRender.forEach(function (e) {
          e();
        }),
        requestAnimationFrame(browserController.renderLoop);
    },
    addToResizeLoop: function (e) {
      browserController.state.toResize.push(e);
    },
    resizeBaseWork: function () {
      (browserController.state.rem = (window.innerWidth / 100) * (1e3 / 1440)),
        (browserController.state.isMobile = window.innerWidth < 800),
        (browserController.state.isPortrait =
          window.innerHeight > window.innerWidth);
    },
    onResize: function () {
      clearTimeout(browserController.state.resizeTimeout),
        (browserController.state.resizeTimeout = setTimeout(
          browserController.resizeLoop,
          100
        ));
    },
    resizeLoop: function () {
      browserController.resizeBaseWork(),
        browserController.state.toResize.forEach(function (e) {
          e();
        });
    },
  },
  key = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ',
  scramble = '5DphrLu1HVIW PoCcjX64ES9q8laQTyktJAnBRx2i7gUbvsOm3wZK0fzNeMYFdG',
  detailController = {
    state: {
      shareUrl: 'https://memes.reflexer.finance/share',
      baseUrl: '',
      hash: {},
      dehash: {},
      gridItem: null,
      timeout: null,
      shareButtons: [],
    },
    init: function () {
      detailController.initHash();
    },
    initHash: function () {
      for (var e = 0; e < key.length; e++)
        (detailController.state.hash[key[e]] = scramble[e]),
          (detailController.state.dehash[scramble[e]] = key[e]);
    },
    initPage: function (e, t) {
      (detailController.state.gridItem = t),
        (detailController.state.data = [
          { name: 'u', value: t.uid },
          { name: 'v', value: '1' },
        ]);
      for (
        var r = e.getElementsByClassName('detail__inputGroup'), n = 0;
        n < r.length;
        n++
      )
        detailController.initInput(r[n]);
      e
        .getElementsByClassName('previewButton')[0]
        .addEventListener('click', detailController.previewLink),
        e
          .getElementsByClassName('copyButton')[0]
          .addEventListener('click', detailController.copyLink),
        e
          .getElementsByClassName('facebookButton')[0]
          .addEventListener(
            'click',
            detailController.socialLink.bind({ platform: 'facebook' })
          ),
        e
          .getElementsByClassName('twitterButton')[0]
          .addEventListener(
            'click',
            detailController.socialLink.bind({ platform: 'twitter' })
          );
    },
    initInput: function (e) {
      var t = e.getElementsByClassName('count')[0],
        r = e.querySelector('input, textarea'),
        n = {
          el: e,
          countEl: t,
          inputEl: r,
          maxCount: Number(t.getAttribute('data-max')) || 0,
          count: 0,
          value: '',
          name: r.name,
        };
      detailController.state.data.push(n),
        r.addEventListener('input', detailController.onInputChange.bind(n));
    },
    onInputChange: function () {
      (this.value = detailController.parseValue(this)),
        (this.inputEl.value = this.value),
        (this.count = this.value.length),
        (this.countEl.innerHTML = this.count);
    },
    parseValue: function (e) {
      var t = e.inputEl.value;
      return (t = t.substring(0, e.maxCount));
    },
    generateLink: function () {
      var t = '?';
      return (
        detailController.state.data.forEach(function (e) {
          (t += e.name + '='),
            (t += detailController.encodeValue(e.value)),
            (t += '&');
        }),
        (t = t.substring(0, t.length - 1)),
        detailController.state.shareUrl + t
      );
    },
    encodeValue: function (e) {
      for (var t = '', r = 0; r < e.length; r++) {
        var n = detailController.state.hash[e[r]];
        null == n && (n = e[r]), (t += n);
      }
      return (t = t.split(' ').join('_')), (t = encodeURIComponent(t));
    },
    decodeValue: function (e) {
      var t = decodeURIComponent(e);
      t = t.split('_').join(' ');
      for (var r = '', n = 0; n < t.length; n++) {
        var o = detailController.state.dehash[t[n]];
        null == o && (o = t[n]), (r += o);
      }
      return r;
    },
    decodeLink: function (e) {
      var t = e.split('?')[1].split('&'),
        r = {};
      return (
        t.forEach(function (e) {
          var t = e.split('=');
          r[t[0]] = detailController.decodeValue(t[1]);
        }),
        r
      );
    },
    previewLink: function () {
      var e = detailController.generateLink();
      // event('share', 'preview', 'click', !0),
      window.open(e, '_blank');
    },
    copyLink: function () {
      copyToClipboard(detailController.generateLink());
      var e = this;
      e.classList.add('copied'),
        clearTimeout(detailController.state.timeout),
        (detailController.state.timeout = setTimeout(function () {
          e.classList.remove('copied');
        }, 3e3)),
        soundUtil.play('bells');
      // event('share', 'copy', 'click', !0);
    },
    socialLink: function () {
      var e = detailController.generateLink();
      switch (this.platform) {
        case 'facebook':
          // event('share', 'facebook', 'click', !0),
          openURLInPopup((t = makeFB(e)), 600, 400);
          break;
        case 'twitter':
          // event('share', 'twitter', 'click', !0),
          openURLInPopup(
            (t = makeTw('Enjoy RAI Memes World!', 'RAI_Memes_World', e)),
            600,
            400
          );
      }
      soundUtil.play('bells');
    },
  },
  dragUtil = {
    state: { draggableElements: [] },
    init: function () {
      browserController.addToRenderLoop(dragUtil.render),
        window.addEventListener('mouseout', function (e) {
          var t = (e = e || window.event).relatedTarget || e.toElement;
          (t && 'HTML' != t.nodeName) || dragUtil.endAllDrags();
        });
    },
    registerDraggableElement: function (e, t) {
      var r = {
        el: e,
        callback: t,
        dragging: !1,
        startPos: { x: 0, y: 0 },
        currentPos: { x: 0, y: 0 },
        diff: { x: 0, y: 0 },
        thisDiff: { x: 0, y: 0 },
        endDrag: function () {
          this.dragging = !1;
        },
        getDist: function () {
          return Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2));
        },
      };
      e.addEventListener('mousedown', dragUtil.onDragStart.bind(dragUtil, r)),
        e.addEventListener('mousemove', dragUtil.onDragMove.bind(dragUtil, r)),
        e.addEventListener('mouseup', dragUtil.onDragEnd.bind(dragUtil, r)),
        e.addEventListener(
          'touchstart',
          dragUtil.onDragStart.bind(dragUtil, r)
        ),
        e.addEventListener('touchmove', dragUtil.onDragMove.bind(dragUtil, r)),
        e.addEventListener('touchend', dragUtil.onDragEnd.bind(dragUtil, r)),
        dragUtil.state.draggableElements.push(r);
    },
    normalizeEvent: function (e) {
      return (
        e.touches && 0 < e.touches.length
          ? ((e.clientX = e.touches[0].clientX),
            (e.clientY = e.touches[0].clientY))
          : e.clientX || ((e.clientX = 0), (e.clientY = 0)),
        e
      );
    },
    onDragStart: function (e, t) {
      (e.dragging = !0),
        (t = dragUtil.normalizeEvent(t)),
        (e.startPos.x = e.currentPos.x = t.clientX),
        (e.startPos.y = e.currentPos.y = t.clientY),
        (e.diff.x = 0),
        (e.diff.y = 0),
        (e.thisDiff.x = 0),
        (e.thisDiff.y = 0);
    },
    onDragMove: function (e, t) {
      if (e.dragging) {
        (t = dragUtil.normalizeEvent(t)),
          (e.currentPos.x = t.clientX),
          (e.currentPos.y = t.clientY);
        var r = e.currentPos.x - e.startPos.x,
          n = e.currentPos.y - e.startPos.y;
        (e.thisDiff.x = r - e.diff.x),
          (e.thisDiff.y = n - e.diff.y),
          (e.diff.x = r),
          (e.diff.y = n);
      }
    },
    onDragEnd: function (e) {
      e.dragging && (e.endDrag(), e.callback(e));
    },
    endAllDrags: function () {
      dragUtil.state.draggableElements.forEach(function (e) {
        dragUtil.onDragEnd(e);
      });
    },
    clearDraggableElements: function () {
      dragUtil.state.draggableElements = [];
    },
    render: function () {
      dragUtil.state.draggableElements.forEach(function (e) {
        e.dragging && e.callback(e);
      });
    },
  },
  ease = {
    linear: function (e) {
      return e;
    },
    easeInQuad: function (e) {
      return e * e;
    },
    easeOutQuad: function (e) {
      return e * (2 - e);
    },
    easeInOutQuad: function (e) {
      return e < 0.5 ? 2 * e * e : (4 - 2 * e) * e - 1;
    },
    easeInCubic: function (e) {
      return e * e * e;
    },
    easeOutCubic: function (e) {
      return --e * e * e + 1;
    },
    easeInOutCubic: function (e) {
      return e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1;
    },
    easeInQuart: function (e) {
      return e * e * e * e;
    },
    easeOutQuart: function (e) {
      return 1 - --e * e * e * e;
    },
    easeInOutQuart: function (e) {
      return e < 0.5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e;
    },
    easeInQuint: function (e) {
      return e * e * e * e * e;
    },
    easeOutQuint: function (e) {
      return 1 + --e * e * e * e * e;
    },
    easeInOutQuint: function (e) {
      return e < 0.5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e;
    },
    easeInOutCustom: function (e) {
      return e < 0.5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e;
    },
  },
  easeInOut = new bezier(0.57, 0.09, 0.105, 1.005),
  soundArray = [
    [
      detailController.state.baseUrl + '/sounds/bells.mp3',
      'bells',
      { volume: 0.8 },
    ],
    [
      detailController.state.baseUrl + '/sounds/Epic-Cinematic-Trailer.mp3',
      'Epic-Cinematic-Trailer',
      { volume: 0.3, loop: !0 },
    ],
    [
      detailController.state.baseUrl + '/sounds/shuffle-in.mp3',
      'shuffle-in',
      null,
    ],
    [
      detailController.state.baseUrl + '/sounds/shuffle-out.mp3',
      'shuffle-out',
      null,
    ],
    [detailController.state.baseUrl + '/sounds/whoosh.mp3', 'whoosh', null],
    [detailController.state.baseUrl + '/sounds/pop.mp3', 'pop', null],
  ],
  cardArray = document.getElementById('cards-blockie')
    ? JSON.parse(document.getElementById('cards-blockie').innerText)
    : [[]];

function shuffle(e) {
  var t, r, n;
  for (n = e.length - 1; 0 < n; n--)
    (t = Math.floor(Math.random() * (n + 1))),
      (r = e[n]),
      (e[n] = e[t]),
      (e[t] = r);
  return e;
}
shuffle(cardArray);
var gridController = {
  state: {
    items: [],
    colItems: [],
    imageAspect: 0.65,
    screenAspect: window.innerWidth / window.innerHeight,
    gridEl: null,
    rows: 0,
    cols: 0,
    colWidth: 0,
    rowHeight: 0,
    itemSpace: 0,
    itemWidth: 0,
    itemHeight: 0,
    flipWidth: 0,
    flipHeight: 0,
    target: new Vec2(1e8, 1e8),
    offset: new Vec2(1e8, 1e8),
    focus: null,
    selected: null,
    count: 32,
    lerpRate: 1,
    canDrag: !0,
    template: null,
    flipped: !1,
    canIncrement: !0,
    cardArray: null,
    needsCreate: !1,
    canSelect: !1,
  },
  init: function (e) {
    (gridController.state.grid = document.getElementById('grid')),
      dragUtil.registerDraggableElement(
        gridController.state.grid,
        gridController.handleDrag
      ),
      document
        .getElementById('grid-close')
        .addEventListener('click', gridController.deselectItem),
      document
        .getElementById('grid-cta')
        .addEventListener('click', gridController.flipItem),
      document
        .getElementById('grid-up')
        .addEventListener(
          'click',
          gridController.incrementSelected.bind(null, -1)
        ),
      document
        .getElementById('grid-down')
        .addEventListener(
          'click',
          gridController.incrementSelected.bind(null, 1)
        ),
      (gridController.state.template =
        document.getElementById('detail-template')),
      (gridController.state.screenCenter = new Vec2(
        window.innerWidth / 2,
        window.innerHeight / 2.1
      )),
      (gridController.state.cardArray = e),
      gridController.create(),
      browserController.addToRenderLoop(this.render),
      browserController.addToResizeLoop(this.handleResize);
  },
  handleResize: function () {
    (gridController.state.screenCenter = new Vec2(
      window.innerWidth / 2,
      window.innerHeight / 2.1
    )),
      gridController.state.canDrag
        ? gridController.create()
        : (gridController.positionCardsInCenter(),
          (gridController.state.needsCreate = !0));
  },
  create: function () {
    gridController.state.screenAspect = window.innerWidth / window.innerHeight;
    for (
      var e = gridController.state.cardArray,
        t = e.length,
        r =
          gridController.state.screenAspect / gridController.state.imageAspect,
        n = 1,
        o = t / n;
      n / o < r;

    )
      o = t / ++n;
    (o = Math.ceil(o)), (n = Math.floor(t / o));
    var i = 4.7;
    browserController.state.isPortrait && (i = 4),
      browserController.state.isMobile && (i = 2.5);
    var a = window.innerWidth / i;
    (gridController.state.rows = o),
      (gridController.state.cols = n),
      (gridController.state.colWidth = a),
      (gridController.state.itemSpace = 0.1 * a),
      (gridController.state.itemWidth = a - gridController.state.itemSpace),
      (gridController.state.itemHeight =
        gridController.state.itemWidth / gridController.state.imageAspect),
      (gridController.state.rowHeight =
        gridController.state.itemHeight + gridController.state.itemSpace),
      (gridController.state.flipWidth = gridController.state.colWidth * n),
      (gridController.state.flipHeight = gridController.state.rowHeight * o),
      (gridController.state.count = o * n),
      (gridController.state.grid.innerHTML = ''),
      (gridController.state.colItems = []),
      (gridController.state.items = []);
    for (var l = 0, s = 0; s < n; s++) {
      gridController.state.colItems.push([]);
      for (var d = 0; d < o; d++) this.createItem(d, s, e[l]), l++;
    }
  },
  createItem: function (e, t, r) {
    var n = {
        row: e,
        col: t,
        el: document.createElement('div'),
        offset: new Vec2(0, 0),
        pos: new Vec2(0, 0),
        target: new Vec2(0, 0),
        zDistance: 0,
        zTarget: 0,
        zRate: 0.1,
        angle: 0,
        angleTarget: 0,
        index: gridController.state.items.length,
        order: 0,
        uid: r[1],
        card: document.createElement('div'),
        back: document.createElement('div'),
        image: gridController.createImage(r[0], 'grid__itemPicture'),
        close: document.createElement('div'),
        anim: null,
      },
      o = document.createElement('div'),
      i = n.image.cloneNode(!0);
    (n.el.className = 'grid__item'),
      (n.card.className = 'grid__itemCard'),
      (n.back.className = 'grid__itemBack'),
      (n.close.className = 'grid__itemClose pointer'),
      (o.className = 'grid__itemThumb'),
      (i.className = 'grid__itemThumbInner'),
      n.close.addEventListener('click', gridController.unflip),
      n.card.append(n.image),
      o.append(i),
      n.card.append(n.back),
      n.back.append(n.close),
      n.back.append(o),
      n.el.append(n.card),
      gridController.state.grid.append(n.el),
      (n.el.style.height = gridController.state.itemHeight + 'px'),
      (n.el.style.width = gridController.state.itemWidth + 'px'),
      n.el.addEventListener('mousedown', gridController.setFocus.bind(n)),
      n.el.addEventListener('touchstart', gridController.setFocus.bind(n)),
      (n.offset.x =
        t * (gridController.state.itemWidth + gridController.state.itemSpace)),
      (n.offset.y =
        e * (gridController.state.itemHeight + gridController.state.itemSpace) +
        (t % 2 == 0 ? 0 : gridController.state.itemHeight / 2) +
        40 * t),
      gridController.state.items.push(n),
      gridController.state.colItems[t].push(n);
  },
  createImage: function (e, t) {
    var r = e;
    n = document.createElement('picture');
    n.classList.add(t);
    var o = document.createElement('source');
    o.setAttribute('srcset', r + '?fm=webp 1x'),
      o.setAttribute('type', 'image/webp'),
      n.append(o);
    var i = document.createElement('source');
    i.setAttribute('srcset', r + ' 1x'),
      i.setAttribute('type', 'image/jpeg'),
      n.append(i);
    var a = document.createElement('img');
    return a.setAttribute('src', r), a.setAttribute('alt', e), n.append(a), n;
  },
  handleDrag: function (e) {
    if (gridController.state.canDrag) {
      var t = browserController.state.isMobile ? 2 : 1.5;
      (gridController.state.target.x += e.thisDiff.x * t),
        (gridController.state.target.y += e.thisDiff.y * t),
        0 == e.dragging &&
          (e.getDist() < 10 &&
            gridController.state.focus &&
            (!gridController.state.selected && gridController.state.canSelect
              ? gridController.selectItem(gridController.state.focus)
              : gridController.deselectItem(),
            (gridController.state.canSelect = !0)),
          (gridController.state.focus = null));
    }
    document.documentElement.classList.contains('show-intro') &&
      (rds('show-intro'),
      setTimeout(function () {
        gridController.state.canSelect = !0;
      }, 1e3));
  },
  setFocus: function () {
    gridController.state.focus = this;
  },
  selectItem: function (e) {
    (gridController.state.canDrag = !1),
      e.el.classList.add('grid__item--selected');
    var l = e;
    (gridController.state.selected = e),
      gridController.state.items.forEach(function (e, t) {
        var r = new Vec2(e.pos.x, e.pos.y),
          n = e.el.getBoundingClientRect(),
          o = new Vec2(n.left + n.width / 2, n.top + n.height / 2),
          i = gridController.state.screenCenter.minus(o);
        (e.centerPos = gridController.state.screenCenter.minus(
          new Vec2(n.width / 2, n.height / 2)
        )),
          gridController.setOrder(e);
        var a =
          5 * (gridController.state.count - e.order) +
          300 * Math.random() +
          100;
        (e.angleTarget = 10 * Math.random() * (t % 2 == 0 ? 1 : -1)),
          e == l && ((a = 0), (e.angleTarget = 0)),
          setTimeout(function () {
            animUtil.runAnimation(
              gridController.moveToCenterAnim.bind({
                start: r,
                item: e,
                move: i,
              }),
              600,
              easeInOut
            );
          }, a);
      }),
      gridController.setSelectedNumber(),
      ads('show-grid-overlay'),
      ads('enter', 'grid-overlay'),
      soundUtil.play('shuffle-in');
    // event('navigation', 'forwards', 'grid', !0);
  },
  focusOnItemAnim: function (e) {
    (gridController.state.target.x = gridController.state.offset.x =
      this.start.x + this.move.x * e),
      (gridController.state.target.y = gridController.state.offset.y =
        this.start.y + this.move.y * e);
  },
  moveToCenterAnim: function (e) {
    (this.item.target.x = this.item.pos.x = this.start.x + this.move.x * e),
      (this.item.target.y = this.item.pos.y = this.start.y + this.move.y * e);
  },
  positionCardsInCenter: function () {
    gridController.state.items.forEach(function (e, t) {
      var r = e.el.getBoundingClientRect(),
        n = new Vec2(
          gridController.state.screenCenter.x - r.width / 4,
          gridController.state.screenCenter.y - r.height / 4
        );
      (e.target.x = e.pos.x = n.x),
        (e.target.y = e.pos.y = n.y),
        gridController.drawItem(e);
    });
  },
  deselectItem: function () {
    gridController.state.selected.el.classList.remove('grid__item--selected'),
      gridController.unflip(),
      (gridController.state.selected = null),
      (gridController.state.lerpRate = 0.19),
      setTimeout(function () {
        (gridController.state.canDrag = !0),
          (gridController.state.lerpRate = 1);
      }, 500),
      rds('show-grid-overlay'),
      rds('enter', 'grid-overlay'),
      ads('exit', 'grid-overlay'),
      setTimeout(function () {
        rds('exit', 'grid-overlay');
      }, 500),
      soundUtil.play('shuffle-out'),
      // event('navigation', 'backwards', 'overlay', !0),
      gridController.state.needsCreate &&
        (gridController.create(), (gridController.state.needsCreate = !1));
  },
  incrementSelected: function (e) {
    if (
      gridController.state.selected &&
      !gridController.state.flipped &&
      gridController.state.canIncrement
    ) {
      (gridController.state.canIncrement = !1),
        setTimeout(function () {
          gridController.state.canIncrement = !0;
        }, 150);
      var t = gridController.state.selected.index;
      if (
        ((t =
          (t + e + gridController.state.count) % gridController.state.count),
        gridController.state.selected.el.classList.remove(
          'grid__item--selected'
        ),
        0 < e)
      ) {
        var r = gridController.state.selected;
        r.order += 5;
        var n = {
          item: r,
          start: r.centerPos,
          width: r.el.getBoundingClientRect().width,
          order: r.order,
        };
        r.anim = animUtil.runAnimation(
          gridController.sendToBackAnim.bind(n),
          800,
          ease.linear,
          function () {
            (r.zRate = 0.1), gridController.setOrder(r);
          }
        );
      }
      if (
        ((gridController.state.selected = gridController.state.items[t]),
        gridController.state.selected.el.classList.add('grid__item--selected'),
        e < 0)
      ) {
        var o = gridController.state.selected;
        o.order -= 5;
        n = {
          item: o,
          start: o.centerPos,
          width: o.el.getBoundingClientRect().width,
          order: o.order,
        };
        o.anim = animUtil.runAnimation(
          gridController.sendToFrontAnim.bind(n),
          900,
          ease.linear,
          function () {
            (o.zRate = 0.1), gridController.setOrder(o);
          }
        );
      }
      gridController.state.items.forEach(function (e, t) {
        (e.anim && !e.anim.finished) || gridController.setOrder(e);
      }),
        gridController.setSelectedNumber(),
        soundUtil.play('whoosh');
    }
  },
  setSelectedNumber: function () {
    (document.getElementById('grid-current').innerHTML =
      gridController.state.selected.index + 1),
      (document.getElementById('grid-total').innerHTML =
        gridController.state.count);
  },
  setOrder: function (e) {
    e.order = gridController.getOrder(e);
  },
  getOrder: function (e) {
    return (
      gridController.state.count -
      ((e.index -
        gridController.state.selected.index +
        gridController.state.count) %
        gridController.state.count)
    );
  },
  sendToBackAnim: function (e) {
    if (e < 0.5) {
      var t = ease.easeInOutQuad(e / 0.5);
      this.item.target.x = this.item.pos.x =
        this.start.x + 1.3 * gridController.state.itemWidth * t;
    } else if (0.5 < e) {
      t = ease.easeInOutQuad((e - 0.5) / 0.5);
      this.item.target.x = this.item.pos.x =
        this.start.x + 1.3 * gridController.state.itemWidth * (1 - t);
    }
    if (0.3 < e && e <= 0.9) {
      this.item.zRate = 1;
      t = ease.easeInOutQuad((e - 0.3) / 0.6);
      var r = gridController.getOrder(this.item);
      this.item.order = Math.round(this.order + (r - this.order) * t);
    } else
      0.9 < e &&
        ((this.item.zRate = 0.1),
        (this.item.order = gridController.getOrder(this.item)));
  },
  sendToFrontAnim: function (e) {
    if (e < 0.3) {
      var t = ease.easeInOutQuad(e / 0.3);
      this.item.target.x = this.item.pos.x =
        this.start.x + 1.3 * gridController.state.itemWidth * t;
    } else if (0.3 < e) {
      t = easeInOut((e - 0.3) / 0.7);
      this.item.target.x = this.item.pos.x =
        this.start.x + 1.3 * gridController.state.itemWidth * (1 - t);
    }
    if (0.1 < e && e <= 0.5) {
      this.item.zRate = 1;
      t = ease.easeInOutQuad((e - 0.1) / 0.4);
      var r = gridController.getOrder(this.item);
      this.item.order = Math.round(this.order + (r - this.order) * t);
    } else
      0.5 < e &&
        ((this.item.zRate = 0.1),
        (this.item.order = gridController.getOrder(this.item)));
  },
  flipItem: function () {
    if (gridController.state.selected) {
      gridController.state.flipped = !0;
      var e = gridController.state.template.cloneNode(!0);
      (e.id = ''),
        gridController.state.selected.back.append(e),
        detailController.initPage(e, gridController.state.selected),
        scrollAnimations.initFragment(gridController.state.selected.back),
        ads('show-flip'),
        ads('exit', 'grid-overlay'),
        soundUtil.play('whoosh'),
        // event('navigation', 'forwards', 'overlay', !0),
        setTimeout(function () {
          gridController.state.selected.back.classList.add('enter');
        }, 300);
    }
  },
  unflip: function () {
    if (gridController.state.flipped) {
      gridController.state.selected.back.classList.remove('enter'),
        rds('show-flip'),
        rds('exit', 'grid-overlay');
      var e =
        gridController.state.selected.back.getElementsByClassName('detail')[0];
      e &&
        setTimeout(function () {
          e.remove();
        }, 500),
        // event('navigation', 'backwards', 'detail', !0),
        (gridController.state.flipped = !1),
        soundUtil.play('whoosh');
    }
  },
  render: function () {
    gridController.state.offset.lerp(gridController.state.target, 0.1),
      gridController.state.items.forEach(gridController.updateItem),
      gridController.state.items.forEach(gridController.drawItem);
  },
  updateItem: function (e) {
    var t = gridController.state.selected == e;
    if (gridController.state.selected) {
      var r = gridController.state.flipped ? 10 : 6;
      e.zTarget = 2 * e.order - gridController.state.count + (t ? r : 0);
    } else
      (e.target.x =
        ((e.offset.x + gridController.state.offset.x) %
          gridController.state.flipWidth) -
        gridController.state.colWidth),
        (e.target.y =
          ((e.offset.y + gridController.state.offset.y) %
            gridController.state.flipHeight) -
          gridController.state.rowHeight),
        (e.zTarget = 0),
        (e.angleTarget = 0);
    e.pos.lerp(e.target, gridController.state.lerpRate),
      (e.zDistance += (e.zTarget - e.zDistance) * e.zRate),
      (e.angle += 0.1 * ((t ? 0 : e.angleTarget) - e.angle));
  },
  drawItem: function (e) {
    if (browserController.state.isMobile) t = window.innerWidth / 40;
    else
      var t =
        1.5 * Math.min(12, Math.max(0, window.innerHeight - 550) / 40 + 4);
    (e.el.style.transform =
      'translate3d(' +
      e.pos.x +
      'px, ' +
      e.pos.y +
      'px, ' +
      e.zDistance * t +
      'px) rotate(' +
      e.angle +
      'deg)'),
      (e.el.style.zIndex = Math.round(e.order)),
      e == gridController.state.selected
        ? (e.image.style.boxShadow = '0 2.5rem 3.5rem rgba(0,0,0,0.4)')
        : (e.image.style.boxShadow = '');
  },
};

var navigationController = {
  init: function () {
    '/' == window.location.pathname
      ? navigationController.initDefault()
      : navigationController.initShare();
  },
  initDefault: function () {
    document
      .getElementById('start-site')
      .addEventListener('click', this.startSite),
      gridController.init(cardArray),
      ads('enter', 'preload');
  },
  startSite: function () {
    ads('exit', 'preload'),
      setTimeout(function () {
        ads('show-grid'),
          setTimeout(function () {
            ads('show-intro');
          }, 300);
      }, 400),
      soundUtil.play('bells'),
      soundUtil.play('Epic-Cinematic-Trailer');
    // event('navigation', 'forwards', 'intro', !0);
  },
  initShare: function () {
    shareController.init(),
      setTimeout(function () {
        ads('enter', 'share-open');
      }, 1e3);
  },
};
function ads(e, t) {
  (document.getElementById(t) || document.documentElement).classList.add(e);
}
function rds(e, t) {
  (document.getElementById(t) || document.documentElement).classList.remove(e);
}
function tds(e, t) {
  (document.getElementById(t) || document.documentElement).classList.contains(e)
    ? rds(e)
    : ads(e);
}
var scrollAnimations = {
    state: {
      sas: [],
      staggerCounts: {},
      entered: !1,
      pageTime: 0,
      staggerEls: [],
    },
    init: function () {
      browserController.addToRenderLoop(scrollAnimations.render);
    },
    initPage: function (e, t) {
      t || (scrollAnimations.state.sas = []);
      for (var r = e.getElementsByClassName('sa'), n = 0; n < r.length; n++)
        scrollAnimations.create(r[n]);
      (scrollAnimations.state.staggerCounts = {}),
        t || (scrollAnimations.state.staggerEls = []);
      var o = e.querySelectorAll('[data-sa-stagger]');
      for (n = 0; n < o.length; n++) scrollAnimations.setStagger(o[n]);
      t || (scrollAnimations.state.pageTime = 0);
    },
    initFragment: function (e) {
      scrollAnimations.initPage(e, !0);
    },
    create: function (e) {
      var t = e.getBoundingClientRect(),
        r = Number(e.getAttribute('data-sa-offset')) || t.height / 2,
        n = Number(e.getAttribute('data-sa-ignore')) || 0,
        o = {
          el: e,
          offset: t.top + r + browserController.state.scrollTop,
          entered: !1,
          delay: e.getAttribute('data-sa-delay') || 0,
          timeout: null,
          ignore: n,
        };
      scrollAnimations.state.sas.push(o);
    },
    setStagger: function (e) {
      var t = e.getAttribute('data-sa-stagger'),
        r = Number(e.getAttribute('data-sa-stagger-speed')) || 150;
      scrollAnimations.state.staggerCounts[t] ||
        (scrollAnimations.state.staggerCounts[t] = 0);
      var n = Math.pow(scrollAnimations.state.staggerCounts[t], 0.9) * r,
        o = Math.min(
          200,
          Math.pow(scrollAnimations.state.staggerCounts[t], 0.6) * r
        );
      (e.style.transitionDelay = n + 'ms'),
        e.classList.add('sa-staggered'),
        e.setAttribute('data-exit-delay', o),
        scrollAnimations.state.staggerCounts[t]++,
        scrollAnimations.state.staggerEls.push(e);
    },
    render: function () {
      scrollAnimations.state.entered &&
        (scrollAnimations.state.sas.forEach(scrollAnimations.renderSingle),
        (scrollAnimations.state.pageTime += browserController.state.delta));
    },
    renderSingle: function (e) {
      !e.entered &&
        e.ignore <= scrollAnimations.state.pageTime &&
        browserController.state.scrollTop + window.innerHeight > e.offset &&
        ((e.entered = !0),
        setTimeout(function () {
          e.el.classList.add('enter');
        }, e.delay));
    },
    exitPage: function () {
      (scrollAnimations.state.entered = !1),
        scrollAnimations.state.staggerEls.forEach(function (e) {
          var t = Number(e.getAttribute('data-exit-delay'));
          e.style.transitionDelay = t + 'ms';
        }),
        scrollAnimations.state.sas.forEach(function (e) {
          clearTimeout(e.timeout), e.entered && e.el.classList.add('exit');
        });
    },
    enterPage: function () {
      scrollAnimations.state.entered = !0;
    },
  },
  ShaderProgram = (function () {
    function s(e) {
      var t = this,
        r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
      _classCallCheck(this, s),
        (r = Object.assign(
          {
            antialias: !1,
            depthTest: !1,
            mousemove: !1,
            autosize: !0,
            side: 'front',
            vertex:
              '\n        precision highp float;\n\n        attribute vec4 a_position;\n        attribute vec4 a_color;\n\n        uniform float u_time;\n        uniform vec2 u_resolution;\n        uniform vec2 u_mousemove;\n        uniform mat4 u_projection;\n\n        varying vec4 v_color;\n\n        void main() {\n\n          gl_Position = u_projection * a_position;\n          gl_PointSize = (10.0 / gl_Position.w) * 100.0;\n\n          v_color = a_color;\n\n        }',
            fragment:
              '\n        precision highp float;\n\n        uniform sampler2D u_texture;\n        uniform int u_hasTexture;\n\n        varying vec4 v_color;\n\n        void main() {\n\n          if ( u_hasTexture == 1 ) {\n\n            gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);\n\n          } else {\n\n            gl_FragColor = v_color;\n\n          }\n\n        }',
            uniforms: {},
            buffers: {},
            camera: {},
            texture: null,
            onUpdate: function () {},
            onResize: function () {},
          },
          r
        ));
      var n = Object.assign(
          {
            time: { type: 'float', value: 0 },
            hasTexture: { type: 'int', value: 0 },
            resolution: { type: 'vec2', value: [0, 0] },
            mousemove: { type: 'vec2', value: [0, 0] },
            projection: {
              type: 'mat4',
              value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            },
          },
          r.uniforms
        ),
        o = Object.assign(
          { position: { size: 3, data: [] }, color: { size: 4, data: [] } },
          r.buffers
        ),
        i = Object.assign(
          { fov: 60, near: 1, far: 1e4, aspect: 1, z: 100, perspective: !0 },
          r.camera
        ),
        a = document.createElement('canvas'),
        l = a.getContext('webgl', { antialias: r.antialias });
      if (!l) return !1;
      (this.count = 0),
        (this.gl = l),
        (this.canvas = a),
        (this.camera = i),
        (this.holder = e),
        (this.onUpdate = r.onUpdate),
        (this.onResize = r.onResize),
        (this.data = {}),
        e.appendChild(a),
        this.createProgram(r.vertex, r.fragment),
        this.createBuffers(o),
        this.createUniforms(n),
        this.updateBuffers(),
        this.updateUniforms(),
        this.createTexture(r.texture),
        l.enable(l.BLEND),
        l.enable(l.CULL_FACE),
        l.blendFunc(l.SRC_ALPHA, l.ONE),
        l[r.depthTest ? 'enable' : 'disable'](l.DEPTH_TEST),
        r.autosize &&
          window.addEventListener(
            'resize',
            function (e) {
              return t.resize(e);
            },
            !1
          ),
        r.mousemove &&
          window.addEventListener(
            'mousemove',
            function (e) {
              return t.mousemove(e);
            },
            !1
          ),
        this.resize(),
        (this.update = this.update.bind(this)),
        (this.time = { start: performance.now(), old: performance.now() }),
        this.update();
    }
    return (
      _createClass(s, [
        {
          key: 'mousemove',
          value: function (e) {
            var t = (e.pageX / this.width) * 2 - 1,
              r = (e.pageY / this.height) * 2 - 1;
            this.uniforms.mousemove = [t, r];
          },
        },
        {
          key: 'resize',
          value: function () {
            var e = this.holder,
              t = this.canvas,
              r = this.gl,
              n = (this.width = e.offsetWidth),
              o = (this.height = e.offsetHeight),
              i = (this.aspect = n / o),
              a = devicePixelRatio;
            (t.width = n * a),
              (t.height = o * a),
              (t.style.width = n + 'px'),
              (t.style.height = o + 'px'),
              r.viewport(0, 0, n * a, o * a),
              r.clearColor(0, 0, 0, 0),
              (this.uniforms.resolution = [n, o]),
              (this.uniforms.projection = this.setProjection(i)),
              this.onResize(n, o, a);
          },
        },
        {
          key: 'setProjection',
          value: function (e) {
            var t = this.camera;
            if (t.perspective) {
              t.aspect = e;
              var r = t.fov * (Math.PI / 180),
                n = Math.tan(0.5 * Math.PI - 0.5 * r),
                o = 1 / (t.near - t.far),
                i = [
                  n / t.aspect,
                  0,
                  0,
                  0,
                  0,
                  n,
                  0,
                  0,
                  0,
                  0,
                  (t.near + t.far) * o,
                  -1,
                  0,
                  0,
                  t.near * t.far * o * 2,
                  0,
                ];
              return (i[14] += t.z), (i[15] += t.z), i;
            }
            return [
              2 / this.width,
              0,
              0,
              0,
              0,
              -2 / this.height,
              0,
              0,
              0,
              0,
              1,
              0,
              -1,
              1,
              0,
              1,
            ];
          },
        },
        {
          key: 'createShader',
          value: function (e, t) {
            var r = this.gl,
              n = r.createShader(e);
            if (
              (r.shaderSource(n, t),
              r.compileShader(n),
              r.getShaderParameter(n, r.COMPILE_STATUS))
            )
              return n;
            console.log(r.getShaderInfoLog(n)), r.deleteShader(n);
          },
        },
        {
          key: 'createProgram',
          value: function (e, t) {
            var r = this.gl,
              n = this.createShader(r.VERTEX_SHADER, e),
              o = this.createShader(r.FRAGMENT_SHADER, t),
              i = r.createProgram();
            r.attachShader(i, n),
              r.attachShader(i, o),
              r.linkProgram(i),
              r.getProgramParameter(i, r.LINK_STATUS)
                ? (r.useProgram(i), (this.program = i))
                : (console.log(r.getProgramInfoLog(i)), r.deleteProgram(i));
          },
        },
        {
          key: 'createUniforms',
          value: function (e) {
            var r = this,
              n = this.gl,
              o = (this.data.uniforms = e),
              i = (this.uniforms = {});
            Object.keys(o).forEach(function (t) {
              (o[t].location = n.getUniformLocation(r.program, 'u_' + t)),
                Object.defineProperty(i, t, {
                  set: function (e) {
                    (o[t].value = e), r.setUniform(t, e);
                  },
                  get: function () {
                    return o[t].value;
                  },
                });
            });
          },
        },
        {
          key: 'setUniform',
          value: function (e, t) {
            var r = this.gl,
              n = this.data.uniforms[e];
            switch (((n.value = t), n.type)) {
              case 'int':
                r.uniform1i(n.location, t);
                break;
              case 'float':
                r.uniform1f(n.location, t);
                break;
              case 'vec2':
                r.uniform2f.apply(
                  r,
                  [n.location].concat(_toConsumableArray(t))
                );
                break;
              case 'vec3':
                r.uniform3f.apply(
                  r,
                  [n.location].concat(_toConsumableArray(t))
                );
                break;
              case 'vec4':
                r.uniform4f.apply(
                  r,
                  [n.location].concat(_toConsumableArray(t))
                );
                break;
              case 'mat2':
                r.uniformMatrix2fv(n.location, !1, t);
                break;
              case 'mat3':
                r.uniformMatrix3fv(n.location, !1, t);
                break;
              case 'mat4':
                r.uniformMatrix4fv(n.location, !1, t);
            }
          },
        },
        {
          key: 'updateUniforms',
          value: function () {
            var r = this,
              n = (this.gl, this.data.uniforms);
            Object.keys(n).forEach(function (e) {
              var t = n[e];
              r.uniforms[e] = t.value;
            });
          },
        },
        {
          key: 'createBuffers',
          value: function (e) {
            var r = this,
              n = (this.gl, (this.data.buffers = e)),
              o = (this.buffers = {});
            Object.keys(n).forEach(function (t) {
              var e = n[t];
              (e.buffer = r.createBuffer('a_' + t, e.size)),
                Object.defineProperty(o, t, {
                  set: function (e) {
                    (n[t].data = e),
                      r.setBuffer(t, e),
                      'position' == t && (r.count = n.position.data.length / 3);
                  },
                  get: function () {
                    return n[t].data;
                  },
                });
            });
          },
        },
        {
          key: 'createBuffer',
          value: function (e, t) {
            var r = this.gl,
              n = this.program,
              o = r.getAttribLocation(n, e),
              i = r.createBuffer();
            return (
              r.bindBuffer(r.ARRAY_BUFFER, i),
              r.enableVertexAttribArray(o),
              r.vertexAttribPointer(o, t, r.FLOAT, !1, 0, 0),
              i
            );
          },
        },
        {
          key: 'setBuffer',
          value: function (e, t) {
            var r = this.gl,
              n = this.data.buffers;
            (null == e && !r.bindBuffer(r.ARRAY_BUFFER, null)) ||
              (r.bindBuffer(r.ARRAY_BUFFER, n[e].buffer),
              r.bufferData(r.ARRAY_BUFFER, new Float32Array(t), r.STATIC_DRAW));
          },
        },
        {
          key: 'updateBuffers',
          value: function () {
            this.gl;
            var t = this.buffers;
            Object.keys(t).forEach(function (e) {
              return (t[e] = buffer.data);
            }),
              this.setBuffer(null);
          },
        },
        {
          key: 'createTexture',
          value: function (e) {
            var t = this.gl,
              r = t.createTexture();
            t.bindTexture(t.TEXTURE_2D, r),
              t.texImage2D(
                t.TEXTURE_2D,
                0,
                t.RGBA,
                1,
                1,
                0,
                t.RGBA,
                t.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
              ),
              (this.texture = r),
              e && ((this.uniforms.hasTexture = 1), this.loadTexture(e));
          },
        },
        {
          key: 'loadTexture',
          value: function (e) {
            var t = this.gl,
              r = this.texture,
              n = new Image();
            (n.onload = function () {
              t.bindTexture(t.TEXTURE_2D, r),
                t.texImage2D(
                  t.TEXTURE_2D,
                  0,
                  t.RGBA,
                  t.RGBA,
                  t.UNSIGNED_BYTE,
                  n
                ),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR),
                t.texParameteri(
                  t.TEXTURE_2D,
                  t.TEXTURE_WRAP_S,
                  t.CLAMP_TO_EDGE
                ),
                t.texParameteri(
                  t.TEXTURE_2D,
                  t.TEXTURE_WRAP_T,
                  t.CLAMP_TO_EDGE
                );
            }),
              (n.src = e);
          },
        },
        {
          key: 'update',
          value: function () {
            var e = this.gl,
              t = performance.now(),
              r = (t - this.time.start) / 5e3,
              n = t - this.time.old;
            (this.time.old = t),
              (this.uniforms.time = r),
              0 < this.count &&
                (e.clear(e.COLORBUFFERBIT),
                e.drawArrays(e.POINTS, 0, this.count)),
              this.onUpdate(n),
              requestAnimationFrame(this.update);
          },
        },
      ]),
      s
    );
  })(),
  shareController = {
    state: { data: null },
    init: function () {
      window.location.search
        ? ((shareController.state.data = shareController.getData(
            window.location.href
          )),
          shareController.create(shareController.state.data))
        : null;
    },
    getData: function (e) {
      return detailController.decodeLink(e);
    },
    create: function (e) {
      var t = shareController.getUid(e);
      document
        .getElementById('share-image')
        .append(gridController.createImage(t[0])),
        (document.getElementById('share-title').innerHTML = e.t),
        (document.getElementById('share-message').innerHTML = e.m),
        (document.getElementById('share-from').innerHTML = e.f),
        document
          .getElementById('share-open')
          .addEventListener('click', shareController.open);
    },
    getUid: function (t) {
      var r = null;
      return (
        cardArray.forEach(function (e) {
          t.u == e[1] && (r = e);
        }),
        r
      );
    },
    open: function () {
      tds('open-share'),
        ads('exit', 'share-open'),
        setTimeout(function () {
          ads('enter', 'share-inner');
        }, 800),
        soundUtil.play('bells'),
        soundUtil.play('jingle-bells');
      // event('navigation', 'open', 'card', !0);
    },
    socialLink: function (e) {
      var t = window.location.href;
      switch (e) {
        case 'facebook':
          // event('share-share', 'facebook', 'click', !0),
          openURLInPopup((r = makeFB(t)), 600, 400);
          break;
        case 'twitter':
          // event('share-share', 'twitter', 'click', !0),
          openURLInPopup(
            (r = makeTw('Enjoy RAI Memes World!', 'RAI Memes World', t)),
            600,
            400
          );
          break;
      }
    },
  };

var soundUtil = {
  sounds: {},
  state: { muted: !1, defaultVolume: 0.5 },
  init: function (e) {
    this.loadSounds(e),
      document
        .getElementById('mute')
        .addEventListener('click', soundUtil.toggleMute),
      soundUtil.initEls();
  },
  initEls: function () {
    on('.button, .circleButton', 'mouseover', function () {
      soundUtil.play('pop');
    });
  },
  loadSounds: function (e) {
    e.forEach(soundUtil.createSound);
  },
  createSound: function (e) {
    var t = new Audio(e[0]),
      r = e[2];
    (t.volume = r && r.volume ? r.volume : soundUtil.state.defaultVolume),
      r && r.loop && (t.loop = !0),
      (soundUtil.sounds[e[1]] = {
        uid: e[1],
        src: e[0],
        options: e[2],
        clip: t,
      });
  },
  play: function (e, t) {
    var r = soundUtil.sounds[e];
    r && (t || (r.clip.currentTime = 0), r.clip.play());
  },
  pause: function (e) {
    var t = soundUtil.sounds[e];
    t && t.clip.pause();
  },
  stop: function (e) {
    var t = soundUtil.sounds[e];
    t && (t.clip.pause(), (t.clip.currentTime = 0));
  },
  toggleMute: function () {
    (soundUtil.state.muted = !soundUtil.state.muted),
      soundUtil.state.muted ? soundUtil.muteSounds() : soundUtil.unmuteSounds();
  },
  muteSounds: function () {
    objectLoop(soundUtil.sounds, function (e) {
      e.clip.muted = !0;
    }),
      document.getElementById('mute').classList.add('muted');
  },
  unmuteSounds: function () {
    objectLoop(soundUtil.sounds, function (e) {
      e.clip.muted = !1;
    }),
      document.getElementById('mute').classList.remove('muted');
  },
};
function hasClass(e, t) {
  return e.classList
    ? e.classList.contains(t)
    : new RegExp('\\b' + t + '\\b').test(e.className);
}
function addClass(e, t) {
  e.classList ? e.classList.add(t) : hasClass(e, t) || (e.className += ' ' + t);
}
function removeClass(e, t) {
  e.classList
    ? e.classList.remove(t)
    : (e.className = e.className.replace(
        new RegExp('\\b' + t + '\\b', 'g'),
        ''
      ));
}
function on(n, e, o, i) {
  addEvent(i || document, e, function (e) {
    for (
      var t, r = e.target || e.srcElement;
      r && r.matches && r !== i && !(t = r.matches(n));

    )
      r = r.parentElement;
    t && o.call(r, e);
  });
}
function addEvent(e, t, r) {
  e.attachEvent ? e.attachEvent('on' + t, r) : e.addEventListener(t, r);
}
function removeEvent(e, t, r) {
  e.detachEvent ? e.detachEvent('on' + t, r) : e.removeEventListener(t, r);
}
function forEach(e, t) {
  for (var r = 0, n = e.length; r < n; r++) t(e[r], r);
}
function auto_grow(e) {
  e.style.height = '0px';
  var t = window.innerWidth / 100,
    r = Math.min(e.scrollHeight, 9 * t);
  e.style.height = r + 'px';
}
function copyToClipboard(e) {
  var t = document.createElement('textarea');
  return (
    (t.value = e),
    document.body.appendChild(t),
    t.select(),
    document.execCommand('copy'),
    document.body.removeChild(t),
    !0
  );
}
function openURLInPopup(e, t, r, n) {
  void 0 === t && ((t = 800), (r = 600)),
    void 0 === r && (r = 600),
    popup(e, n, t, r, ', menubar=0,location=0,toolbar=0,status=0,scrollbars=1');
}
function popup(e, t, r, n, o) {
  var i = window.open(e, t, 'width=' + r + ', height=' + n + o);
  window.focus && i.focus();
}
function countChar(e) {
  var t = e.value.length;
  $('#charNum').text(280 - t + ' characters remaining'),
    280 < t
      ? $('#charNum').css('color', 'red')
      : $('#charNum').css('color', 'white');
}
function amperoctoplus(e) {
  return (e = (e = (e = (e = (e = e.replace(/&/g, '%26')).replace(
    /#/g,
    '%23'
  )).replace(/\+/g, '%2B')).replace(/@/g, '%40')).replace(/:/g, '%3A'));
}
function makeFB(e) {
  return (
    'https://www.facebook.com/sharer/sharer.php?u=' +
    amperoctoplus(encodeURI(e))
  );
}
function makeTw(e, t, r) {
  return (
    'https://twitter.com/intent/tweet?text=' +
    amperoctoplus(encodeURI(e)) +
    '&hashtags=' +
    amperoctoplus(encodeURI(t)) +
    '&url=' +
    amperoctoplus(encodeURI(r))
  );
}

var openMailLink = function (e) {
  var t = document.createElement('iframe');
  (t.src = e),
    (t.width = 1),
    (t.height = 1),
    (t.border = 0),
    (t.frameborder = 0),
    (t.style.position = 'fixed'),
    document.documentElement.append(t),
    window.setTimeout(function () {
      t.remove();
    }, 1e3);
};
function objectLoop(e, t) {
  var r = 0;
  for (var n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t(e[n], n, r), r++;
}
// function event(e, t, r, n) {
//   ga && ga('send', 'event', e, t, r, n);
// }
function Vec2(e, t) {
  (this.x = e),
    (this.y = t),
    (this.lerp = function (e, t) {
      (this.x += (e.x - this.x) * t), (this.y += (e.y - this.y) * t);
    }),
    (this.plus = function (e) {
      return new Vec2(this.x + e.x, this.y + e.y);
    }),
    (this.minus = function (e) {
      return new Vec2(this.x - e.x, this.y - e.y);
    }),
    (this.length = function () {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    });
}

function initSnow() {
  var e = document.querySelector('#snow'),
    t = {
      current: 0,
      force: 0.05,
      target: 0,
      min: 0,
      max: 0.05,
      easing: 0.005,
    };
  new ShaderProgram(e, {
    depthTest: !1,
    texture:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGAGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTUtMDctMDNUMTg6NTk6MjIrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTAxLTEyVDE1OjE0OjQwKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTAxLTEyVDE1OjE0OjQwKzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmIzMzBlMWI0LTk5ZDctNGU2NS05MGQ2LTNmYjFiYmE2ZTE0MCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjAyNThjNzMxLTQ4ZjQtYTA0MS1hNGFkLTQ4MTA2MTVjY2FlYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJjY2VkMTUyLTRjNzAtNDFlZC1hMzcyLWRlOWY4NjgyZTcwMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmNjZWQxNTItNGM3MC00MWVkLWEzNzItZGU5Zjg2ODJlNzAxIiBzdEV2dDp3aGVuPSIyMDE1LTA3LTAzVDE4OjU5OjIyKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjMzMGUxYjQtOTlkNy00ZTY1LTkwZDYtM2ZiMWJiYTZlMTQwIiBzdEV2dDp3aGVuPSIyMDE5LTAxLTEyVDE1OjE0OjQwKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50mbqsAAAToElEQVR4nOVbW49dR5X+VlXtc2v3Ne52N6bTTnAc0u02GRJQwEhYQkJ5QhmhPPOUl0iBB/4AP4JfMA95IEIaJEYiQhlesCZMEE1iGxJHIjK21XbSwX1xd5+zd9Va87BrVdfefWwI4xEaUVJpn7PPPnVqfbUu31pVh0QE/8zN/KMn8I9uTl+8+uqrAAARgYgghIBer4dnnnkGAPDFL34RANDr9eiJJ55AVVUgIhhjwMwYDAbY3Nyk8+fPP/DHdnd3ZWtr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',
    uniforms: {
      worldSize: { type: 'vec3', value: [0, 0, 0] },
      gravity: { type: 'float', value: 70 },
      wind: { type: 'float', value: 0 },
    },
    buffers: {
      size: { size: 1, data: [] },
      rotation: { size: 3, data: [] },
      speed: { size: 3, data: [] },
    },
    vertex:
      '\n      precision highp float;\n\n      attribute vec4 a_position;\n      attribute vec4 a_color;\n      attribute vec3 a_rotation;\n      attribute vec3 a_speed;\n      attribute float a_size;\n\n      uniform float u_time;\n      uniform vec2 u_mousemove;\n      uniform vec2 u_resolution;\n      uniform mat4 u_projection;\n      uniform vec3 u_worldSize;\n      uniform float u_gravity;\n      uniform float u_wind;\n\n      varying vec4 v_color;\n      varying float v_rotation;\n\n      void main() {\n\n        v_color = a_color;\n        v_rotation = a_rotation.x + u_time * a_rotation.y;\n\n        vec3 pos = a_position.xyz;\n\n        pos.x = mod(pos.x + u_time + u_wind * a_speed.x, u_worldSize.x * 2.0) - u_worldSize.x;\n        pos.y = mod(pos.y - u_time * a_speed.y * u_gravity, u_worldSize.y * 2.0) - u_worldSize.y;\n\n        pos.x += sin(u_time * a_speed.z) * a_rotation.z;\n        pos.z += cos(u_time * a_speed.z) * a_rotation.z;\n\n        gl_Position = u_projection * vec4( pos.xyz, a_position.w );\n        gl_PointSize = ( a_size / gl_Position.w ) * 100.0;\n\n      }',
    fragment:
      '\n      precision highp float;\n\n      uniform sampler2D u_texture;\n\n      varying vec4 v_color;\n      varying float v_rotation;\n\n      void main() {\n\n        vec2 rotated = vec2(\n          cos(v_rotation) * (gl_PointCoord.x - 0.5) + sin(v_rotation) * (gl_PointCoord.y - 0.5) + 0.5,\n          cos(v_rotation) * (gl_PointCoord.y - 0.5) - sin(v_rotation) * (gl_PointCoord.x - 0.5) + 0.5\n        );\n\n        vec4 snowflake = texture2D(u_texture, rotated);\n\n        gl_FragColor = vec4(snowflake.rgb, snowflake.a * v_color.a);\n\n      }',
    onResize: function (e, t, r) {
      var n = [],
        o = [],
        i = [],
        a = [],
        l = [],
        s = (e / t) * 110;
      Array.from({ length: (e / t) * 4e3 }, function (e) {
        n.push(
          -s + Math.random() * s * 2,
          110 * Math.random() * 2 - 110,
          80 * Math.random() * 2
        ),
          l.push(
            0.5 + 0.5 * Math.random(),
            0.5 + 0.5 * Math.random(),
            5 * Math.random()
          ),
          a.push(
            2 * Math.random() * Math.PI,
            20 * Math.random(),
            10 * Math.random()
          ),
          o.push(1, 1, 1, 0.1 + 0.2 * Math.random()),
          i.push(2 * Math.random() * 3 * ((t * r) / 1e3));
      }),
        (this.uniforms.worldSize = [s, 110, 80]),
        (this.buffers.position = n),
        (this.buffers.color = o),
        (this.buffers.rotation = a),
        (this.buffers.size = i),
        (this.buffers.speed = l);
    },
    onUpdate: function (e) {
      (t.force += (t.target - t.force) * t.easing),
        (t.current += t.force * (0.2 * e)),
        (this.uniforms.wind = t.current),
        0.995 < Math.random() &&
          (t.target =
            (t.min + Math.random() * (t.max - t.min)) *
            (0.5 < Math.random() ? -1 : 1));
    },
  });
}

function init() {
  browserController.initialize(),
    animUtil.init(),
    scrollAnimations.init(),
    scrollAnimations.initPage(document),
    dragUtil.init(),
    detailController.init(),
    browserController.state.isMobile || initSnow(),
    setTimeout(function () {
      ads('ready'), navigationController.init(), soundUtil.init(soundArray);
    }, 1e3);
}
'loading' != document.readyState
  ? init()
  : document.addEventListener
  ? document.addEventListener('DOMContentLoaded', init)
  : document.attachEvent('onreadystatechange', function () {
      'complete' == document.readyState && init();
    });
