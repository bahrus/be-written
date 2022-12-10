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

## Notification when finished

When the streaming has finished, the element adorned by the be-written decorator emits event: "be-decorated.be-written.resolved".

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

