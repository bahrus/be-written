# be-written [TODO]

Stream a url to a target element.

```html
<details be-written='{
    "from": "https://html.spec.whatwg.org/",
    "to": "div",
    "beBased": {
        "rules": [{
            "match": "a",
            "attr": "href",
            "ifNot": "^(http|https)",
            "baseHref": "https://www.supremecourt.gov/about/"
        }]
        //no asynch within this processing, so don't use dtr
       
    },
    "transform":{

    },
    "shadowRoot": "open"
}'>
    <summary>HTML Specs</summary>
    <div></div>
</details>
```

If "to" is ".",  writes directly to its light children.

https://stackoverflow.com/questions/59999736/how-to-block-image-from-loading-in-javascript

