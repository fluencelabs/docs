# Installation

Adding the Fluence JS client for your web application is very easy.

## Browser-based Apps

1. Add a script tag with the JS Client bundle to your `index.html`. The easiest way to do this is using a CDN (like [JSDELIVR](https://www.jsdelivr.com/) or [UNPKG](https://unpkg.com/)). The script is large, thus we highly recommend to use the `async` attribute.

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

   If you cannot or don't want to use a CDN, feel free to get the script directly from the [npm package](https://www.npmjs.com/package/@fluencelabs/js-client.web.standalone) and host it yourself. You can find the script in the `/dist` directory of the package. (Note: this option means that developers understand what they are doing and know how to serve this file from their own web server.)

2. Install the following packages:

   ```
   npm i @fluencelabs/js-client.api @fluencelabs/fluence-network-environment
   ```

3. Add the following lines at the beginning of your code:

   ```
   import { Fluence } from "@fluencelabs/js-client.api";
   import { randomKras } from '@fluencelabs/fluence-network-environment';

   Fluence.connect(randomKras());
   ```

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

   ```
   npm i @fluencelabs/js-client.api"@fluencelabs/js-client.node @fluencelabs/fluence-network-environment
   ```

2. Add the following lines at the beginning of your code:

   ```
   import '@fluencelabs/js-client.node';
   import { Fluence } from "@fluencelabs/js-client.api";
   import { randomKras } from '@fluencelabs/fluence-network-environment';

   Fluence.connect(randomKras());
   ```
