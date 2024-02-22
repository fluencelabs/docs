# Hello world example

## Intro

In this section, we will demonstrate how the Fluence JS Client can be used to create a "Hello, world!" application using the Fluence stack.

Make sure you have finished **Setting up** step. 

## Aqua code

Let's start with the Aqua code first:

```aqua
import Peer from "@fluencelabs/aqua-lib/builtin.aqua" -- (0)

service HelloWorld("hello-world"):                    -- (1)
    hello(str: string)
    getFortune() -> string

func sayHello():                                      -- (2)
    HelloWorld.hello("Hello, world!")

func tellFortune() -> string:                         -- (3)
    res <- HelloWorld.getFortune()
    <- res

func getRelayTime() -> u64:                           -- (4)
    on HOST_PEER_ID:
        ts <- Peer.timestamp_ms()
    <- ts
```

First, we need to import definitions to call standard Peer operations. They are marked as (0). The file has three definitions:

(1) is a service named `HelloWorld`. The service interfaces functions executable on a peer. We will register a handler for this interface in our TypeScript application.

(2) and (3) are functions `sayHello` and `tellFortune` correspondingly. These functions are very simple. The only thing the first one does is calling the `hello` method of the `HelloWorld` service located on the current peer. Similarly, `tellFortune` calls the `getFortune` method from the same service and returns the value to the caller. We will show how to call these function from a TypeScript application.

Finally, we have a function (4) which demonstrate how to work with the network. It asks the current time from the relay peer and returns it back to our peer.

## Writing some code

Put the aqua code above in the `aqua/hello-world.aqua` file and compile it.

Let's see how to use the generated code in our application. Place the code below in `src/index.ts` file:

```typescript
import { 
    Fluence, // Import the API for JS Client
    randomKras // // Import function for choosing random relay from list of possible relay nodes (network environment)
} from "@fluencelabs/js-client";  
import {
  registerHelloWorld,
  sayHello,
  getRelayTime,
  tellFortune,
} from "./_aqua/hello-world"; // Aqua compiler provides functions which can be directly imported like any normal TypeScript function.

await Fluence.connect(randomKras()); // Connecting to the fourth kras node.

/*
For every exported `service XXX` definition in aqua code, the compiler provides a `registerXXX` counterpart. These functions provide a type-safe way of registering callback handlers for the services. The callbacks are executed when the appropriate service is called in Aqua on the current peer. The handlers take the form of an object where keys are names of functions and values are async functions used as the corresponding callbacks. For example, in (3) we are registering handlers for `HelloWorld` service functions which outputs its parameter to the console. Please note that the handlers can be implemented in both synchronous and asynchronous ways. The handler can be made asynchronous like any other function in javascript: either return a Promise or mark it with the async keyword to take advantage of the async-await pattern.
*/
registerHelloWorld({
    hello: (str) => {
        console.log(str);
    },
    getFortune: async () => {
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
        return "Wealth awaits you very soon.";
    },
});

/*
For every exported `func XXX` definition in aqua code, the compiler provides an async function which can be directly called from typescript.
For example, we are calling an aqua function called `sayHello`:
*/
await sayHello();

/*
And here we are calling the `tellFortune` function.
Please keep in mind that all functions are asynchronous.
*/
console.log(await tellFortune());

const relayTime = await getRelayTime();

console.log("The relay time is: ", new Date(relayTime).toLocaleString());

// You should call `disconnect` to prevent your application from hanging.
await Fluence.disconnect();
```

Let's try running the example:

```sh
node --loader ts-node/esm src/index.ts
```

If everything has been done correctly, you should see `Hello, world!` in the console.

