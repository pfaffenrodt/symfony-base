import $ from 'jquery';

export default ($target, offset = 0, callback = () => {}) => {
  if (!$target.length) {
    return;
  }

  $('html, body').animate({
    scrollTop: $target.offset().top - $('.header').height() - offset,
  }, 300, 'swing', callback);
};
