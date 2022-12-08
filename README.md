# be-written

Stream a url to a target element.

```html
<details be-written='{
    "from": "https://html.spec.whatwg.org/",
    "to": "div"
}'>
    <summary>HTML Specs</summary>
    <div></div>
</details>
```

If "to" is ".",  writes directly to its light children.