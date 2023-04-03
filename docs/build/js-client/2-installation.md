# Installation

Adding the Fluence JS client for your web application is very easy.

## Browser-based Apps

1. Add a script tag with the JS Client bundle to your `index.html`. The easiest way to do this is using a CDN such as [JSDELIVR](https://www.jsdelivr.com/) or [UNPKG](https://unpkg.com/)). Since the script is large, we recommend using the `async` attribute.

   Here is an example using the JSDELIVR CDN:

   ```html
   <head>
     <title>Cool App</title>
     <script
       src="https://cdn.jsdelivr.net/npm/@fluencelabs/js-client.web.standalone@0.13.3/dist/js-client.min.js"
       async
     ></script>
   </head>
   ```

   If you cannot, or don't want to, use a CDN, feel free to get the script directly from the [npm package](https://www.npmjs.com/package/@fluencelabs/js-client.web.standalone) and host it yourself. You can find the script in the `/dist` directory of the package.

2. Install the following packages:

   ```bash
   npm i @fluencelabs/js-client.api @fluencelabs/fluence-network-environment
   ```

3. Add the following lines at the beginning of your code:

   ```js
   import { Fluence } from "@fluencelabs/js-client.api";
   import { randomKras } from '@fluencelabs/fluence-network-environment';           // 1

   Fluence.connect(randomKras());                                                   // 2
   ```

Fluence has multiple networks including *testnet*, *stage* and *kras*, with *kras* being the stable, default developer network. Fluence networks and associate metadata are encapsulated in the *@fluencelabs/fluence-network-environment* package, which includes a shortcut for random peer selection, such as *randomKras* for the *kras* network. Once imported (1), we can use the *randomKras* function as an import in our connection (2), our web client is ready to go. Note the return of the *randomKras* function is the multiaddr of a relay, i.e. a publicly accessible peer to the network **and** from the network back to the web peer, if needed.

## Node.js Apps

**Prerequisites:**

The Fluence JS Client only supports the ES module format. This implies that some preliminary steps are necessary:

- Add `"type": "module"` to your package.json.
- Replace `"main": "index.js"` with `"exports": "./index.js"` in your package.json.
- Remove `'use strict';` from all JavaScript files.
- Replace all `require()`/`module.export` with `import`/`export`.
- Use only full relative file paths for imports: `import x from '.';` → `import x from './index.js';`.

If you are using TypeScript:

- Make sure you are using TypeScript 4.7 or later.
- Add [`"module": "ESNext", "target": "ESNext", "moduleResolution": "nodenext"`](https://www.typescriptlang.org/tsconfig#module) to your tsconfig.json.
- Use only full relative file paths for imports: `import x from '.';` → `import x from './index.js';`.
- Remove `namespace` usage and use `export` instead.
- You must use a `.js` extension in relative imports even though you're importing `.ts` files.

**Installation:**

1. Install the following packages:

   ```sh
   npm i @fluencelabs/js-client.api @fluencelabs/js-client.node @fluencelabs/fluence-network-environment
   ```

2. Add the following lines at the beginning of your code:

   ```js
   import '@fluencelabs/js-client.node';
   import { Fluence } from "@fluencelabs/js-client.api";
   import { randomKras } from '@fluencelabs/fluence-network-environment';

   Fluence.connect(randomKras());
   ```
