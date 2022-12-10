# be-written [TODO]

Stream a url to a target element.

```html
<div be-written=https://html.spec.whatwg.org></div>
```

... streams the contents of https://html.spec.whatwg.org into the div.

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

If "to" is ".",  writes directly to its light children.

https://stackoverflow.com/questions/59999736/how-to-block-image-from-loading-in-javascript

