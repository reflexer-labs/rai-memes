function amperoctoplus(e) {
  return (e = (e = (e = (e = (e = e.replace(/&/g, '%26')).replace(
    /#/g,
    '%23'
  )).replace(/\+/g, '%2B')).replace(/@/g, '%40')).replace(/:/g, '%3A'));
}
export const makeFB = (e) => {
  return (
    'https://www.facebook.com/sharer/sharer.php?u=' +
    amperoctoplus(encodeURI(e))
  );
};
export const makeTw = (e, t, r) => {
  return (
    'https://twitter.com/intent/tweet?text=' +
    amperoctoplus(encodeURI(e)) +
    '&hashtags=' +
    amperoctoplus(encodeURI(t)) +
    '&url=' +
    amperoctoplus(encodeURI(r))
  );
};

export const key =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ';
export const scramble =
  '5DphrLu1HVIW PoCcjX64ES9q8laQTyktJAnBRx2i7gUbvsOm3wZK0fzNeMYFdG';

export const initHash = () => {
  let hash = {};
  let dehash = {};
  for (var e = 0; e < key.length; e++) {
    hash[key[e]] = scramble[e];
    dehash[scramble[e]] = key[e];
  }
  return { hash, dehash };
};

export const decodeValue = (e) => {
  const { dehash } = initHash();
  let t = decodeURIComponent(e);
  t = t.split('_').join(' ');
  let r = '';
  for (let n = 0; n < t.length; n++) {
    var o = dehash[t[n]];
    null == o && (o = t[n]);
    r += o;
  }
  return r;
};

export const encodeValue = (e, hash) => {
  let t = '';
  for (let r = 0; r < e.length; r++) {
    var n = hash[e[r]];
    null == n && (n = e[r]);
    t += n;
  }
  t = t.split(' ').join('_');
  return (t = encodeURIComponent(t));
};

export function openURLInPopup(e, t = 800, r = 600, n) {
  popup(e, n, t, r, ', menubar=0,location=0,toolbar=0,status=0,scrollbars=1');
}
export function popup(e, t, r, n, o) {
  var i = window.open(e, t, 'width=' + r + ', height=' + n + o);
  window.focus && i.focus();
}
