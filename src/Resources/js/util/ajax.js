import $ from 'jquery';

import notify from '../module/notify';
import translate from './translate';

let loading;

export default (opts) => {
  const options = {
    method: 'POST',
    url: window.location.href,
    data: {},
    done: $.noop,
    fail: $.noop,
    always: $.noop,
    $button: null,
    errorMessage: translate('error.general'),
    errorType: 'error',
    errorTime: 3000,
    ...opts,
  };

  const { $button } = options;

  if ($button) {
    $button
      .addClass('loading')
      .data('text', $button.text() || $button.data('text'))
      .text('')
      .trigger('blur');
  }

  if (loading && !options.allowParallelRequests) {
    loading.abort();
  }

  loading = $.ajax(options)
    .done((response) => options.done(response))
    .fail((response) => {
      if (response.statusText === 'abort') {
        return;
      }

      options.fail(response);

      notify({
        type: options.errorType,
        text: options.errorMessage,
        time: options.errorTime,
      });
    }).always(() => {
      if ($button) {
        $button
          .text($button.data('text'))
          .removeClass('loading');
      }

      options.always();
    });
};
