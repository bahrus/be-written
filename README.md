# be-written

[![NPM version](https://badge.fury.io/js/be-written.png)](http://badge.fury.io/js/be-written)
[![Playwright Tests](https://github.com/bahrus/be-written/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-written/actions/workflows/CI.yml)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-written?style=for-the-badge)](https://bundlephobia.com/result?p=be-written)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-written?compression=gzip">

Stream a url to a target element.

```html
<div be-written=https://html.spec.whatwg.org></div>
```

... streams the contents of https://html.spec.whatwg.org into the div.

The syntax above is shorthand for:

```html
<div be-written='{
    "from": "https://html.spec.whatwg.org/",
    "to": ".",
    "reqInit": {},
    "beBased": true
}'>
```

If "to" is ".", be-written  writes directly to its (shadow) children.

reqInit is the second optional parameter of fetch.

beBased indicates to enable rewriting url's coming from third parties.  Having it set to true (the default), does impose something of a performance cost, so set it to false if that works okay.

> **Note**:   By streaming content into the live DOM Document, it is quite possible the browser will find itself performing multiple page reflows.  Be sure to use the Chrome Dev tools (for example) | rendering | web vitals to watch for any performance issues.  Various CSS approaches can be employed to minimize this:

1.  [content-vsibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)
2.  [contain](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
3.  [overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) - worst case?

> **Note**:  To be HTML5 compliant, use data-be-written for the attribute name instead.


## With Shadow DOM

```html
<details be-written='{
    "from": "https://html.spec.whatwg.org/",
    "to": "div",
    "shadowRoot": "open"
}'>
    <summary>HTML Specs</summary>
    <div></div>
</details>
```

> **Note**:  The [json-in-html](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html#:~:text=In%20addition%2C%20json-in-html%20supports%20editing%20json%20within%20html,which%20often%20make%20heavy%20use%20of%20JSON-serialized%20attributes.) vs-code plugin makes editing JSON attributes like this much more pleasant / natural.

## Styling

By default, *be-written* adds class "be-written-in-progress" to the element it adorns while the streaming is in progress.

The name of the class be overridden ("inProgressCss": "whatever-you-want").

## Notification when finished

When the streaming has finished, the element adorned by the be-written decorator emits event: "be-decorated.written.resolved".

## Lazy Loading

*be-written* already has some lazy-loading built in -- the decorator only becomes activated when the element it adorns has been rendered (so if it is inside a details element, it will not stream until the details element is expanded).

But it does start streaming even if the element is well outside the viewable area.

For true lazy loading, set "defer" to true, and adorn the element with [be-oosoom](https://github.com/bahrus/be-oosoom):

```html
<div be-oosoom be-written='{
    "from": "https://html.spec.whatwg.org/",
    "defer": true
}'></div>
```

## Viewing Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-written/be-written.js';
```

## CDN

```JavaScript
import 'https://esm.run/be-written';

```

