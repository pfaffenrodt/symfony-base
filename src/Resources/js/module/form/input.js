import $ from 'jquery';

import keyCode from '../../util/keycode';
import { validate } from './validate';

const checkValue = ($input) => {
  const type = $input.attr('type');

  if (type === 'checkbox' || type === 'file'
    || type === 'radio' || $input.prop('tagName') === 'SELECT') {
    return;
  }

  const $formRow = $input.closest('.form__row');

  if ($input.val()) {
    $formRow.addClass('form__row--has-value');
  } else {
    $formRow.removeClass('form__row--has-value');
  }
};

export default () => {
  $('input, select').each((index, input) => {
    const $input = $(input);

    checkValue($input);

    $input.on('change', () => {
      checkValue($input);

      if ($input.is(':required') || $input.data('required')) {
        validate($input);
      }
    });

    if ($input.attr('type') === 'number') {
      $input.on('keydown', ({ which }) => which !== keyCode.e
        && which !== keyCode.dot
        && which !== keyCode.comma
        && which !== keyCode.plus
        && which !== keyCode.minus
        && which !== keyCode.numComma
        && which !== keyCode.numPlus
        && which !== keyCode.numMinus);
    }
  });
};