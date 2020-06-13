import $ from 'jquery';

import scrollTo from '../../util/scroll-to';
import translate from '../../util/translate';

const inputNames = [
  'image',
  'password',
  'username',
];

const inputTypes = [
  'checkbox',
  'email',
  'text',
];

const emailInvalid = (value) => value.trim().indexOf(' ') > -1 || !value.match(/\w+@\w+\.\w+/g);

export const validate = ($input) => {
  const name = $input.attr('name');
  const type = $input.attr('type');
  const value = $input.val();
  const isCheckbox = type === 'checkbox';
  const isFileInput = type === 'file';
  const isSelect = $input.prop('tagName') === 'SELECT';
  let error;

  $input
    .closest('.form__row')
    .find('.form__error')
    .remove();

  if (!value || (isSelect && !value.length)) {
    if (inputNames.includes(name)) {
      error = translate(`error.form.${name}.empty`);
    } else if (inputTypes.includes(type)) {
      error = translate(`error.form.${type}.empty`);
    } else {
      error = translate('error.form.text.empty');
    }
  } else if (isCheckbox && !$input.is(':checked')) {
    error = translate('error.form.checkbox.empty');
  } else if (type === 'email' && emailInvalid(value)) {
    error = translate('error.form.email.invalid');
  } else if (type === 'password') {
    const min = $input.attr('min');

    if (value.trim().length < min) {
      error = translate('error.form.password.min', {
        limit: min,
      });
    }
  } else if (isFileInput) {
    Array.from($input[0].files).forEach((file) => {
      const maxSize = $input.data('max-size') || Infinity;
      const mimeTypes = ($input.data('mime-types') || []).split(', ');

      if (file.size > maxSize * 1000000) {
        error = translate('error.form.image.max_size.exceeded', {
          limit: maxSize,
        });
      } else if (!mimeTypes.includes(file.type)) {
        error = translate('error.form.image.mime_type.invalid', {
          types: `"${mimeTypes.join('", "')}"`,
        });
      }
    });
  }

  if (error) {
    const $error = $(`<div class="form__error">${error}</div>`);

    if (isCheckbox) {
      $error.insertAfter($input.closest('.checkbox'));
    } else if (isFileInput) {
      $error.insertAfter($input.closest('.file'));
    } else if (isSelect) {
      $error.insertAfter($input.closest('.select'));
    } else {
      $error.insertAfter($input);
    }

    return false;
  }

  return true;
};

export const validateForm = ($form) => {
  let errorCount = 0;

  $form.find('[required], [data-required]').each((index, input) => {
    errorCount += validate($(input)) ? 0 : 1;
  });

  const $firstError = $form.find('.form__error').first();

  if ($firstError.length) {
    scrollTo(
      $firstError,
      $firstError.height() + $firstError.parent().find('input, .select__selection').height(),
    );
  }

  return errorCount === 0;
};