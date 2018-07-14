import { addEvent, getHandler, removeEvent } from './utils';
import { getTouchY, handleScroll } from './handleScroll';
import { EVENTS } from './defaultEvents';
import { isInside, LOCKY_GROUP, shouldIgnoreEvent } from './isInside';

export const lockyGroup = (selector, group) => {
  [...document.querySelectorAll(selector)].forEach(node => node.setAttribute(LOCKY_GROUP, group));
};

export const lockyOn = (selector, settings = {}) => {
  const ref = typeof selector === 'string' ? document.querySelector(selector) : selector;

  if (!ref) {
    throw new Error('locky: selector', selector, 'is not matching any element.');
  }

  let touchStart = 0;

  const isEventInLock = event => ref && isInside(ref, event.target);

  const getEventHandlers = () => {
    const { noDefault, events } = settings;
    return Object.assign({}, noDefault ? {} : EVENTS, events || {});
  };

  const getEventHandler = (eventName, option) => {
    const handler = getHandler(eventName, option, settings.onEscape);
    if (handler) {
      return (event) => {
        if (!isEventInLock(event) && !shouldIgnoreEvent(event.target)) {
          handler(event);
        }
      };
    }
    return null;
  };

  const scrollWheel = event => handleScroll(ref, event, event.deltaY, settings.preventOnly);
  const scrollTouchStart = (event) => {
    touchStart = getTouchY(event);
  };
  const scrollTouchMove = event => handleScroll(ref, event, touchStart - getTouchY(event), settings.preventOnly);

  const handlers = getEventHandlers();
  const documentEvents = Object
    .keys(handlers)
    .map(event => addEvent(document, event, getEventHandler(event, handlers[event]), true))
    .filter(Boolean);

  const nodeEvents = [];
  if (handlers.scroll) {
    nodeEvents.push(...[
      addEvent(ref, 'wheel', scrollWheel, true),
      addEvent(ref, 'touchstart', scrollTouchStart, true),
      addEvent(ref, 'touchmove', scrollTouchMove, true),
    ]);
  }

  if (settings.group) {
    lockyGroup(selector, settings.group);
  }

  return () => {
    documentEvents.forEach(removeEvent);
    nodeEvents.forEach(removeEvent);
  };
};
