# Advanced example

## Intro

In this section, we will demonstrate how the Fluence JS Client and Aqua can be used to provide an IPFS API to Aqua and use it with the Fluence stack.

We will implement given Aqua IPFS interface to interact with IPFS p2p network through the js implementation.

Make sure you have finished **Setting up** step.

## Aqua code

Let's start by defining Aqua interface. The signature will tell us about a service behavior a bit:

```aqua
-- Export signature for making our functions visible outside this file.
export exists, upload_string, remove

-- Alias for making function types closer to IPFS domain definitions.
alias CID : string

-- Service interface. It is what we're going to implement. Implementation could vary depending on client needs.
service IpfsClient("ipfs_client"):
    exists(cid: CID) -> bool
    upload_string(contents: string) -> CID
    remove(cid: CID) -> string

-- Exported functions. Export declarations defined on the first line of code snippet.
func exists(cid: CID) -> bool:
    <- IpfsClient.exists(cid)

func upload_string(contents: string) -> CID:
    <- IpfsClient.upload_string(contents)

func remove(cid: CID) -> string:
    <- IpfsClient.remove(cid)

```

## Install dependencies

We need some specific packages for implementing IPFS service

```sh
npm install helia @helia/strings @helia/dag-json multiformats blockstore-fs datastore-fs
```

## Writing some code

Put the aqua code above in the `aqua/files.aqua` file and compile it.

We will start with implementing `utils.ts` file:

```typescript
import { FsBlockstore } from 'blockstore-fs'; // Import block storage
import { FsDatastore } from 'datastore-fs'; // Import app info storage
import { createHelia } from 'helia'; // Lib for interacting with IPFS

const blockstore = new FsBlockstore('./temp/store');
const datastore = new FsDatastore('./temp/data');

export async function makeHelia() { // Helper func for creating client node which will be used for reading IPFS
    return await createHelia({
        blockstore,
        datastore,
    });
}

export async function timeout<T,>(promise: Promise<T>, timeout: number, abort: AbortController): Promise<T> {
    const timerPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout"));
            abort.abort();
        }, timeout).unref();
    });

    return await Promise.race([promise, timerPromise]);
}

export function noop() {}
```

Let's see how to use the generated code in our application. The `index.ts` file looks this way:

```typescript
import { Fluence, randomTestNet } from '@fluencelabs/js-client'; // Import the API for JS Client
import { exists, registerIpfsClient, remove, upload_string } from './_aqua/files.js'; // Aqua compiler provides functions which can be directly imported like any normal TypeScript function.
import { readFile } from 'node:fs/promises';
import { strings } from '@helia/strings';
import { CID } from 'multiformats/cid';
import { dagJson } from '@helia/dag-json';
import { makeHelia, noop, timeout } from './utils.js';

await Fluence.connect(randomTestNet());

registerIpfsClient({
    async exists(cid: string) {
        const helia = await makeHelia();

        const s = strings(helia);

        const c = CID.parse(cid);

        const controller = new AbortController();
        const content = await timeout(s.get(c, { signal: controller.signal }), 5 /* 5 sec */, controller).catch(noop);

        const result = Boolean(content);
        await helia.stop();
        return result;
    },
    async remove(cid: string) {
        const helia = await makeHelia();

        const c = CID.parse(cid);

        const isPinned = await helia.pins.isPinned(c);

        if (isPinned) {
            console.log('Remove pinned entry:', c.toString());
            const pin = await helia.pins.rm(c);
            await helia.gc();
        }

        await helia.stop();
        return c.toString();
    },
    async upload_string(contents: string) {
        const helia = await makeHelia();

        const s = strings(helia);

        const cid = await s.add(contents);
        await helia.pins.add(cid);

        await helia.stop();
        return cid.toString();
    }
});

const cid = await upload_string('Hello world!!!', { ttl: 120000 });

console.log('cid:', cid.toString());

console.log('Is entry exists:', await exists(cid.toString(), { ttl: 120000 }));

await remove(cid.toString(), { ttl: 120000 });

console.log('Is entry exists:', await exists(cid.toString(), { ttl: 120000 }));

await Fluence.disconnect();
```

Let's try running the example:

```sh
node --loader ts-node/esm ./src/index.ts
```

If everything has been done correctly, you should see the following text in the console:

```
id: bafkreicdktp5u4gi6djzsg454pkw3s3ot4x4nqbrnurvwy5p5m4ii4nnuq
Is entry exists: true
Remove pinned entry: bafkreicdktp5u4gi6djzsg454pkw3s3ot4x4nqbrnurvwy5p5m4ii4nnuq
Is entry exists: false
```

## Conclusion:

Now we have a working service implementation which can be deployed to peer and interacted.

You learned:
- Basic aqua syntax
- How to implement a peer
- Notion of IPFS

You can find remote service call examples [here](https://github.com/fluencelabs/examples)

### Notes

- IPFS local peer stores data in your `./src/temp` folder. You can remove this folder if you want to start to manually clear written data.
- There is an almost 0% chance to pass something to another IPFS peer as we break connection too soon. You can fix this by rewriting code and omitting `helia.stop()` instructions. The longer you keep connection - the higher chances to exchange data.
- This example is not suitable for Fluence peer, because local file changes are not guaranteed to be persistent. 