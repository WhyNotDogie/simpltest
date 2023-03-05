# simpltest
A simple, quick and easy way to test your code.
## Installation
```shell
npm i simpltest
```
## Quick Start
```js
const st = require("simpltest")

st.createTest(Greeter("Carl"), "Greeter")
    .shouldBe(["Hello Carl!", "Whats up, Carl?"])

function Greeter(name) {
    return [`Hello ${name}!`, `Whats up, ${name}?`][Math.floor(Math.random()*2)]
}
```