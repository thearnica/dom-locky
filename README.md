# dom-locky 
[![CircleCI status](https://img.shields.io/circleci/project/github/thearnica/dom-locky/master.svg?style=flat-square)](https://circleci.com/gh/thearnica/dom-locky/tree/master)
[![Greenkeeper badge](https://badges.greenkeeper.io/thearnica/dom-locky.svg)](https://greenkeeper.io/)
, and just __1kb__.
----

[![NPM](https://nodei.co/npm/react-locky.png?downloads=true&stars=true)](https://nodei.co/npm/react-locky/) 

Loki  - is God of Mischief, Madness and Evil!
Locky - is God of Locks, Event capturing and Stealing. Small and very slender brother - just 2kb.

Locky will never let event escape the target node, will prevent scrolls outside, will do the HTML5 `inert` job.
Locky will completely disable any user iterations outside of nested children.

And I've got a twin-brother - [react-locky](https://github.com/theKashey/react-locky)
```js
import {lockyOn} from 'dom-locky';

const unlock = lockyOn('.modal', extraProps);
const unlock = lockyOn(myElement, { onEscape: callback });
//......
unlock();
```

# Unpkg
 You may also include this library from unpkg as [https://unpkg.com/dom-locky](https://unpkg.com/dom-locky).
 Then locky will be available as `locky` global variable.

# API
 Locky accepts selector or HTMLElement as a first argument, and locky will be activated only on the first element matching selector
 Locky accepts a settings as a second argument
 - onEscape, will be triggered when someone will try "escape" the lock. See "report" events below
 - noDefault[=false], disables all "default" events
 - events[=defaultEvents], DOM events to manage
 - group[=null], focus group id. Locks with the same group will not block each other.
 
# Default events
 - click: 'report' (will call `onEscape`)
 - mousemove: true,
 - mousedown: 'report' (will call `onEscape`)
 - touchmove: true,
 - touchstart: 'report' (will call `onEscape`)
 - keydown: true,
 - focus: false, (focus is unblockable)
 - change: false,
 - scroll: true, (scroll is handled separately)
 - wheel: true, 
 
# Tip
__important__ tip for __Mobile Safary__ - while normal "touch move" will
scroll "scrollable" container, touch+move started on inputs will start
__drag-n-drop__ and cause whole layer(modal/page) scroll. 
(it will just scroll as a 💩, or not scroll at all).

To disable this behavior - apply ` -webkit-overflow-scrolling: touch;` on the page.
 
# Licence
 MIT
