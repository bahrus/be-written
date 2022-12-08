# be-written

Stream a url to a target element.

```html
<details be-written='{
    "from": "https://html.spec.whatwg.org/",
    "to": "div",
    "beBased": {
        //no asynch within this processing, so don't use dtr
    }
}'>
    <summary>HTML Specs</summary>
    <div></div>
</details>
```

If "to" is ".",  writes directly to its light children.

https://stackoverflow.com/questions/59999736/how-to-block-image-from-loading-in-javascript

