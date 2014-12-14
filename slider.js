(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'dragdealer'], factory);
  } else {
    factory(root.jQuery, root.Dragdealer);
  }
}(this, function ($, Dragdealer) {
  var NAME = 'slider';
  var INNER_CLASS = NAME + '-inner';
  var ARROW_CLASS = NAME + '-arrow';

  var ARROW_MOVE_EVENTS = 'mouseover mousedown touchstart touchmove';
  var ARROW_STOP_EVENTS = 'mouseleave mouseup touchend';

  function stop (data, evt) { evt.stopPropagation(); evt.preventDefault(); clearInterval(data.moveInterval); }
  function move (data, direction, evt) {
    stop(data, evt);
    data.moveInterval = setInterval(function () {
      var pos = data.dragdealer.getValue();
      data.dragdealer.setValue(
        (pos[0] || 0) + ({
          right: data.hover.speed.x,
          left: -data.hover.speed.x
        }[direction] || 0),
        (pos[1] || 0) + ({
          up:  -data.hover.speed.y,
          down: data.hover.speed.y
        }[direction] || 0)
      );
    }, data.hover.interval);
  }

  return $.fn[NAME] = function (opts) {
    var $this = $(this);
    var data = $this.data()[NAME];
    if (!data) {
      // init
      data = $.extend(true, {
        hover: {speed: {x: .007, y: .007}, interval: 40},
        arrowWidth: 25,
        dragdealerOpts: {
          vertical: true,
          handleClass: INNER_CLASS,
          animationCallback: function (x, y) {
            var outerWidth = $this.width(),            outerHeight = $this.outerHeight();
            var innerWidth = data.$inner.outerWidth(), innerHeight = data.$inner.outerHeight();
            var upDownCss = {
              left:                                           Math.min(outerWidth >= innerWidth   ? 0 : innerWidth * x,        data.arrowWidth),
              right:                                          Math.min(outerWidth >= innerWidth   ? 0 : innerWidth * (1 - x),  data.arrowWidth)
            };
            data.$upArrow   .css($.extend(upDownCss, {height: Math.min(outerHeight >= innerHeight ? 0 : innerHeight * y,       data.arrowWidth)}));
            data.$downArrow .css($.extend(upDownCss, {height: Math.min(outerHeight >= innerHeight ? 0 : innerHeight * (1 - y), data.arrowWidth)}));
            data.$leftArrow .css({width: upDownCss.left});
            data.$rightArrow.css({width: upDownCss.right});
          }
        },

        $inner: $('<div>').append($this.contents()),
        $upArrow:    $('<div><span>&#9650;</span></div>').addClass(ARROW_CLASS + ' ' + ARROW_CLASS+'-up'),
        $rightArrow: $('<div><span>&#9654;</span></div>').addClass(ARROW_CLASS + ' ' + ARROW_CLASS+'-right'),
        $downArrow:  $('<div><span>&#9660;</span></div>').addClass(ARROW_CLASS + ' ' + ARROW_CLASS+'-down'),
        $leftArrow:  $('<div><span>&#9664;</span></div>').addClass(ARROW_CLASS + ' ' + ARROW_CLASS+'-left')
      }, opts);

      $this
        .addClass(NAME)
        .data(NAME, data)

        .append(data.$inner.addClass(INNER_CLASS))
        .append(data.$upArrow
          .on(ARROW_MOVE_EVENTS, move.bind(null, data, 'up'))
          .on(ARROW_STOP_EVENTS, stop.bind(null, data)))
        .append(data.$rightArrow
          .on(ARROW_MOVE_EVENTS, move.bind(null, data, 'right'))
          .on(ARROW_STOP_EVENTS, stop.bind(null, data)))
        .append(data.$downArrow
          .on(ARROW_MOVE_EVENTS, move.bind(null, data, 'down'))
          .on(ARROW_STOP_EVENTS, stop.bind(null, data)))
        .append(data.$leftArrow
          .on(ARROW_MOVE_EVENTS, move.bind(null, data, 'left'))
          .on(ARROW_STOP_EVENTS, stop.bind(null, data)))

      data.dragdealer = new Dragdealer($this[0], data.dragdealerOpts);
    } else {
      $.extend(data, opts);
    }
    return this;
  };
}));
