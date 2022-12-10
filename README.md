# be-written

[![NPM version](https://badge.fury.io/js/be-written.png)](http://badge.fury.io/js/be-written)
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

If "to" is ".",  writes directly to its light children.

reqInit is the second optional parameter of fetch.

## With ShadowDOM

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

