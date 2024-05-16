# Event Handling In The Browser (Event Handling With Clients ?)

The ubiquitous browser is the origin of a large number of diverse events, many of which are triggers for subsequent compute. In order to invoke Fluence Functions from the browser, we need to be able to somehow invoke Aqua scripts from the browser. This can be accomplished with the Fluence [js-client](https://github.com/fluencelabs/js-client). The *js-client* allows you to connect from the browser to the Fluence network and invoke the execution of the desired Aqua.

## Setting Up For The Browser

Just like in the quickstart sections, we use Fluence CLI to scaffold out project with the appropriate template. Initialize the new project with:

```bash
$ fluence init browser-events
```
Choose the `ts` template and the default `kras` environment:

```bash
? Select template quickstart
? Select Fluence Environment to use by default with this project kras (default)
<...>
Successfully initialized Fluence CLI project template at /Users/bebo/localdev/fluence-code/mvm-docs-code/browser-events
```

Before you `cd` into the new directory, recall that you also can non-interactively initialize the project with `fluence init -t ts --env kras <project-name>`. Iime to check out the new project scaffold:

```bash
tree -L 3 -I target
.
├── Cargo.lock
├── Cargo.toml
├── README.md
├── fluence.yaml
└── src
    ├── aqua
    │   └── main.aqua
    ├── frontend
    │   ├── index.html
    │   ├── package.json
    │   ├── src
    │   ├── tsconfig.json
    │   └── vite.config.ts
    └── services
        └── myService
```

The major difference from the scaffolds based on the *quickstart* or *minimal* templates, is the `src/frontend` package for your `js` code. Feel free to poke around the project for a bit and give the default install a whirl. `cd` into the *src/frontend* directory, install the dependencies with  `npm i` and run the default template install with `npm run dev`. If all went well, you should something like:

```bash
VITE v4.4.5  ready in 102 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Looks like your project was initialized and installed as desired and once you copy the provided url, i.e., `http://localhost:5173/`, into your browser, you see four buttons to click. Go head, click away and know, that some of the buttons work and others won't. More on that later.


**
Note: 
why are the templated functions that do not use distributed services useful and of interest? 
What is an example of a serverless workflow that benefits from this approach?
Any chance that web page can be spruced up a bit? Looks like crap.
**

## Event Triggers From The Browser

How about:

* deploy hello world Wasm 
* create browser button


Let's move the IPFS example into a different section, example

For more Browser event goodness, see the ??? and ??? example in the ?? section.
 

## Extending Fluence Functions  [This needs to be moved to a separate section entirely]

As mentioned at the outset and demonstrated in the previous sections, the *js-client* provides client peer capabilities to the Browser, which means that the client, given some constraints, can be called upon from Aqua just like any other distributed service. In fact, the js-client can "host" marine modules not unlike the Rust peer and make said modules available to Aqua workflows.

### Browser

### NodeJS








