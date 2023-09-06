# be-written

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-written)
[![NPM version](https://badge.fury.io/js/be-written.png)](http://badge.fury.io/js/be-written)
[![Playwright Tests](https://github.com/bahrus/be-written/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-written/actions/workflows/CI.yml)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-written?style=for-the-badge)](https://bundlephobia.com/result?p=be-written)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-written?compression=gzip">

Stream a url to a target DOM element.

## Backdrop

In the year 2022/5783/Tiger/2076/2014/47, all browsers have become [stream capable](https://caniuse.com/streams) (🎉), in the context of an already opened HTML page.  This opens a huge number of doors as far as new approaches to building applications.  However, declarative support is not there yet, so this is one of many (I'm sure) attempts to fill the gap.

## Syntax

```html
<div be-written=https://html.spec.whatwg.org></div>
```

... streams the contents of https://html.spec.whatwg.org into the div (well, see below for one significant caveat).

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

## What about security?

Security is a particularly thorny issue for this component, and is one of the many slam dunk reasons this functionality really should be built into the browser, with proper security mechanisms in place.  In particular, the ability to filter out script tags and other dangerous HTML is nearly impossible with the currently available, cross-browser api's, afaik.  So if the stream contains script tags or other such syntax, it will be written with no interference.

In the absence of any signs of mercy from the w3c, we apply security thusly:

1.  Since import maps require the web page to specify things inside a script tag, and onerror attributes are things which are filtered out from most any DOM purification / sanitizing, we can rely on this to assume that if a path is specified by either an import map or a link preload tag with an onerror attribute, the site has given a green light for content coming from that url.
2.  Thus, be-written provides rudimentary support for import maps, and for url resolving via link preload tags, as long as the link tags have onerror attributes. 
3.  Not only does be-written provide this rudimentary support, it **requires** that the path be "endorsed" by one or both of these mechanisms.  

So in fact the example shown above will not work. 

To make it work, do one of the following:

```html
<head>
    <!--doesn't have to be in the head tag, but it's probably where it should go -->
    <script type=importmap>
        {
            "imports": {
                "html-spec/": "https://html.spec.whatwg.org/"
            }
        }
    </script>
</head>
...
<div be-written="html-spec/"></div>
```

and/or:

```html
<head>
    <link
        id="html-spec" 
        rel=preload 
        as=fetch 
        href="https://html.spec.whatwg.org/" 
        onerror="console.error(href)"
    >
</head>
...
<div be-written=html-spec></div>
```

What goes inside the onerror attribute, if anything, is entirely up to each application/developer.  But the presence of the onerror attribute is required to unlock the capability of being streamed into the browser.

## Support for bundling

It seems likely, even with all the advances that HTTP/3 provides, that in cases where most of the users are hit-and-run type visitors, some amount of bundling would be beneficial when it comes time to deploy to production.  Or maybe it is a bit difficult to say which is better - bundling or no bundling, so switching back and forth seamlessly is of upmost importance.

The fact that the necessity for security dictates that we can't directly specify the url of what we want to stream directly in the adorned element, actually can be viewed as a blessing in disguise when we consider how to bundle.  This is how bundling can work quite easily with be-written (but will require some custom solution for whatever build system you are adopting)

### Bundling instructions

1.  If bundling support is needed (potentially), then you must adopt the link preload tag approach mentioned above. Import maps are also fine, and may be more convenient to use during development, but they provide no support for bundling, [due to lack of a standard way of specifying metadata](https://github.com/WICG/import-maps#supplying-out-of-band-metadata-for-each-module).  So link preload tags is the least cumbersome approach.  Don't forget to add the onerror attribute to the link tag.  And remember, if the use of the url won't come into play until well after the page has loaded, use some other value for rel (recommendation: "lazy", or just remove it completely).
2.  If bundling can be accomplished, either during a build process, or dynamically by the server, the process that performs the bundling should add attribute "data-imported" to the link tag, which specifies the id of the template.  The process should also remove "rel=preload" if applicable.

So basically:

```html
<link id=xtal-side-nav/xtal-side-nav.html 
    rel=preload as=fetch href=https://cdn.jsdelivr.net/npm/xtal-side-nav@0.0.110/xtal-side-nav.html 
    onerror=console.error(href)>
```

...becomes, during the build / server rendering process:


```html
<head>
    ...
    <link id=xtal-side-nav/xtal-side-nav.html 
        data-imported=032c2e8a-36a7-4f9c-96a0-673cba30c142 
        onerror=console.error(href)
        as=fetch 
        href=https://cdn.jsdelivr.net/npm/xtal-side-nav@0.0.110/xtal-side-nav.html>
    ...
    <template id=032c2e8a-36a7-4f9c-96a0-673cba30c142>
        <main part=main>
            <button disabled aria-label="Open Menu" part=opener class=opener>&#9776; <slot name=title></slot></button>
            <aside part=side-nav class=side-nav>
                ...
            </aside>
        </main>
    </template>
</head>
```

It may even be better to append (some of) the template(s) at the end of the body tag, if there are many many template imports.  If they are all front loaded in the head tag, it would mean delays before the user can see above the fold content.  

What *be-written* does is search for the matching template by id.  If not found, it waits for document loaded event (if applicable) in case the bundled content was added at the end of the document.  If at that time, it cannot locate the template, it logs an error.

[TODO]:  Support be-a-beacon for faster resolution time.

> [!NOTE]
> This web component is a member of the [be-enhanced](https://github.com/bahrus/be-enhanced) family of [custom enhancements](https://github.com/WICG/webcomponents/issues/1000).  As such, it can also become active during [template instantiation](https://github.com/bahrus/trans-render#extending-tr-dtr-horizontally), though my head spins even thinking about it.

> [!NOTE]
> By streaming content into the live DOM Document, it is quite possible the browser will find itself performing multiple page reflows.  Be sure to use the Chrome Dev tools (for example) | rendering | web vitals to watch for any performance issues.  Various CSS approaches can be employed to minimize this:

1.  [content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)
2.  [contain](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
3.  [overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) - worst case?

> [!NOTE]
> *be-written* tries its best to adjust url's as needed, but mileage may vary, depending on the browser and the time of day (?) as far as avoiding premature downloads (404's).

> [!NOTE]
> If you need to modify the HTML as it streams through,  [be-rewritten](https://github.com/bahrus/be-rewritten) [Big-time WIP, not at all ready for prime time], which is (partly) a stop-gap for this key missing [primitive](https://github.com/whatwg/dom/issues/1222).  However, it has recently come to my attention that there is now a browser-compatible implementation that [supports streaming](https://github.com/worker-tools/html-rewriter).  Payload size seems too high for me to embrace it, but I think it's great they provide that option, in case it meets your needs.

> [!NOTE]
> For importing HTML optimized for HTML-first web components, see [be-importing](https://github.com/bahrus/be-importing).

> [!NOTE]:  To be HTML5 compliant, use data-enh-by-be-written for the attribute name instead [Untested].


## With Shadow DOM

```html
<details be-written='{
    "from": "https://html.spec.whatwg.org/",
    "to": "div",
    "shadowRootMode": "open"
}'>
    <summary>HTML Specs</summary>
    <div></div>
</details>
```

## Between

A crude filter can be applied to the streamed content:

```JavaScript
"between": ["<!--begin-->", "<!--end-->"]
```

It is crude because the way the text streams, it is possible that the sought after string spans across two consecutive chunks.  To make the chances of this breaking anything approach nil, repeat the search string twice:

```html
<template shadowrootmode="open"><!--begin--><!--begin-->
    ...
<!--end--><!--end--></template>
```

## URL Mapping via link preload tags

As alluded to earlier, the "from" parameter can also be the id of a link tag.  If that is the case, the url that is fetched comes from the href property of the link tag.  But remember, the link tag requires having an onerror attribute present to ensure it has been given the green light by the site.

## Support for import maps

Also as mentioned earlier, *be-written* supports rudimentary url substitution based on import maps:

```html
<script type=importmap>{
    "imports":{
        "xtal-side-nav/": "https://cdn.jsdelivr.net/npm/xtal-side-nav@0.0.104/"
    }
}</script>
<xtal-side-nav be-written=xtal-side-nav/xtal-side-nav.html></xtal-side-nav>

```

> **Note**:  The [json-in-html](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html#:~:text=In%20addition%2C%20json-in-html%20supports%20editing%20json%20within%20html,which%20often%20make%20heavy%20use%20of%20JSON-serialized%20attributes.) vs-code plugin makes editing JSON attributes like this much more pleasant / natural.

## Styling

By default, *be-written* adds class "be-written-in-progress" to the element it adorns while the streaming is in progress.

The name of the class can be explicitly set ("inProgressCss": "whatever-you-want").

## Inserts

Because it may be critical to provide custom styling within the shadow DOM (like content-visibility / contains mentioned above), *be-written* provides the ability to slip in a cloned template into the Shadow DOM before the streaming starts.  Likewise, it may be useful to insert some content after - for example providing a link / acknowledgment from where the content came from.

Conceptually, such inserts would look as follows:


```html
<div be-written='{
    "from": "blah.html",
    "inserts": {
        "before": "<div>before</div>",
        "after": "<div>after</div>"
    }
}'></div>
```

The HTML must pass through the standard sanitizing api that is becoming part of the platform.

## Notification when finished

When the streaming has finished, the element adorned by the be-written decorator emits event: "enh-by-be-decorated.written.resolved".

## Lazy Loading

For lazy loading, set "defer" to true, and adorn the element with the [be-oosoom](https://github.com/bahrus/be-oosoom) attribute:

```html
<div be-oosoom be-written='{
    "from": "https://html.spec.whatwg.org/",
    "defer": true
}'></div>
```

## Viewing Locally

Any web server that can serve static html files will do, but...

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

