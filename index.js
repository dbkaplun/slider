require.config({
  paths: {
    jquery: 'https://code.jquery.com/jquery-1.11.1.min',
    dragdealer: 'https://rawgit.com/skidding/dragdealer/master/lib/dragdealer.min',
  },
  shim: {
    // 'slider': {deps: ['dragdealer']}
  }
});

require(['jquery', 'slider'], function (jQuery) {
  jQuery(function ($) {
    var $exampleCode = $('#example-code');
    var $exampleCodeContainer = $exampleCode.parent();
    function evalExampleCode () {
      try {
        eval($exampleCode.val());
        $exampleCodeContainer.removeClass('has-error');
      } catch (e) {
        $exampleCodeContainer.addClass('has-error');
        console.error(e.stack);
      }
    }
    $exampleCode.on('keydown keyup', function () { setTimeout(evalExampleCode, 0); });
    evalExampleCode();
  });
});
