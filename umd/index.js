(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.locky = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var EVENTS = exports.EVENTS = {
  click: 'report',
  mousemove: true,
  mousedown: 'report',
  touchmove: true,
  touchstart: 'report',
  keydown: true,
  change: false,
  scroll: true,
  wheel: true
};
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleScroll = exports.getTouchY = undefined;

var _utils = require('./utils');

var getTouchY = exports.getTouchY = function getTouchY(event) {
  return event.changedTouches[0].clientY;
};

var handleScroll = exports.handleScroll = function handleScroll(endTarget, event, sourceDelta) {
  var preventOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var delta = sourceDelta;
  // find scrollable target
  var target = event.target;


  var shouldCancelScroll = false;
  var isDeltaPositive = delta > 0;

  var availableScroll = 0;
  var availableScrollTop = 0;

  do {
    var _target = target,
        scrollTop = _target.scrollTop,
        scrollHeight = _target.scrollHeight,
        clientHeight = _target.clientHeight;


    availableScroll += scrollHeight - clientHeight - scrollTop;
    availableScrollTop += scrollTop;

    target = target.parentNode;
  } while (endTarget.contains(target));

  if (isDeltaPositive && delta > availableScroll) {
    shouldCancelScroll = true;
  } else if (!isDeltaPositive && -delta > availableScrollTop) {
    shouldCancelScroll = true;
  }

  // cancel scroll
  if (shouldCancelScroll) {
    if (preventOnly) {
      (0, _utils.preventDefault)(event);
    } else {
      (0, _utils.preventAll)(event);
    }
  }
};
},{"./utils":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lockyOn = exports.lockyGroup = undefined;

var _utils = require('./utils');

var _handleScroll = require('./handleScroll');

var _defaultEvents = require('./defaultEvents');

var _isInside = require('./isInside');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var lockyGroup = exports.lockyGroup = function lockyGroup(selector, group) {
  [].concat(_toConsumableArray(document.querySelectorAll(selector))).forEach(function (node) {
    return node.setAttribute(_isInside.LOCKY_GROUP, group);
  });
};

var lockyOn = exports.lockyOn = function lockyOn(selector) {
  var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var ref = typeof selector === 'string' ? document.querySelector(selector) : selector;

  if (!ref) {
    throw new Error('locky: selector', selector, 'is not matching any element');
  }

  var touchStart = 0;

  var getEventHandlers = function getEventHandlers() {
    var noDefault = settings.noDefault,
        events = settings.events;

    return Object.assign({}, noDefault ? {} : _defaultEvents.EVENTS, events || {});
  };

  var getEventHandler = function getEventHandler(eventName, option) {
    var handler = (0, _utils.getHandler)(eventName, option, settings.onEscape);
    if (handler) {
      return function (event) {
        if (!isEventInLock(event) && !(0, _isInside.shouldIgnoreEvent)(event.target)) {
          handler(event);
        }
      };
    }
    return null;
  };

  var scrollWheel = function scrollWheel(event) {
    return (0, _handleScroll.handleScroll)(ref, event, event.deltaY, settings.preventOnly);
  };
  var scrollTouchStart = function scrollTouchStart(event) {
    touchStart = (0, _handleScroll.getTouchY)(event);
  };
  var scrollTouchMove = function scrollTouchMove(event) {
    return (0, _handleScroll.handleScroll)(ref, event, touchStart - (0, _handleScroll.getTouchY)(event), settings.preventOnly);
  };
  var isEventInLock = function isEventInLock(event) {
    return ref && (0, _isInside.isInside)(ref, event.target);
  };

  var handlers = getEventHandlers();
  var documentEvents = Object.keys(handlers).map(function (event) {
    return (0, _utils.addEvent)(document, event, getEventHandler(event, handlers[event]), true);
  }).filter(function (x) {
    return x;
  });

  var nodeEvents = [];
  if (handlers.scroll) {
    nodeEvents.push.apply(nodeEvents, [(0, _utils.addEvent)(ref, 'wheel', scrollWheel, true), (0, _utils.addEvent)(ref, 'touchstart', scrollTouchStart, true), (0, _utils.addEvent)(ref, 'touchmove', scrollTouchMove, true)]);
  }

  if (settings.group) {
    lockyGroup(selector, settings.group);
  }

  return function () {
    documentEvents.forEach(_utils.removeEvent);
    nodeEvents.forEach(_utils.removeEvent);
  };
};
},{"./defaultEvents":1,"./handleScroll":2,"./isInside":4,"./utils":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var LOCKY_GROUP = exports.LOCKY_GROUP = 'data-locky-group';
var LOCKY_TRANSPARENT = exports.LOCKY_TRANSPARENT = 'data-locky-transparent';

var getAllInGroup = function getAllInGroup(node) {
  var group = node.getAttribute(LOCKY_GROUP);
  if (group) {
    return [].concat(_toConsumableArray(document.querySelectorAll('[' + LOCKY_GROUP + '="' + group + '"]')));
  }
  return [node];
};

var isInside = exports.isInside = function isInside(ref, target) {
  var all = getAllInGroup(ref);
  return !!all.find(function (node) {
    return node.contains(target);
  });
};

var shouldIgnoreEvent = exports.shouldIgnoreEvent = function shouldIgnoreEvent(eventNode) {
  var freeNodes = [].concat(_toConsumableArray(document.querySelectorAll('[' + LOCKY_TRANSPARENT + '="true"]')));
  return freeNodes.some(function (node) {
    return node.contains(eventNode);
  });
};
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var preventAll = exports.preventAll = function preventAll(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
};

var preventDefault = exports.preventDefault = function preventDefault(event) {
  event.preventDefault();
};

var report = function report(callback) {
  return function (event) {
    preventAll(event);
    if (callback) {
      callback(event);
    }
  };
};

var reportOnly = function reportOnly(callback) {
  return function (event) {
    if (callback) {
      callback(event);
    }
  };
};

var getHandler = exports.getHandler = function getHandler(event, option, callback) {
  if (!option) {
    return null;
  }

  if (option === 'no-default') {
    return preventDefault;
  }

  if (option === 'report') {
    return report(callback);
  }

  if (option === 'report-only') {
    return reportOnly(callback);
  }

  return preventAll;
};

var addEvent = exports.addEvent = function addEvent(target, event, handler, capture) {
  return handler && {
    target: target,
    event: event,
    handler: (target.addEventListener(event, handler, capture), handler),
    capture: capture
  };
};

var removeEvent = exports.removeEvent = function removeEvent(_ref) {
  var target = _ref.target,
      event = _ref.event,
      handler = _ref.handler,
      capture = _ref.capture;
  return target.removeEventListener(event, handler, capture);
};
},{}]},{},[3])(3)
});
