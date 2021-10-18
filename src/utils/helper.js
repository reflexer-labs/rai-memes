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
