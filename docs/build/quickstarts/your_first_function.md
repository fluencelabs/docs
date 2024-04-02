# Your First Cloudless Function

In this section we pickup where we left off in the [Getting Started](./../overview/getting_started.md) section and dive right back into the *Hello World* example. You can continue to use the FLuence CLI project you created earlier or create a new one. Let's create new project. 

To scaffold our new project:

```bash
fluence init hello-world
```

Which gets you to the template selection prompt:

```bash
? Select template (Use arrow keys)
❯ quickstart
  minimal
  ts
  js
```
Choose the default option, `quickstart`, and stick with the default choice, *dar* for the next prompt which sets the network environment:

```bash
? Select Fluence Environment to use by default with this project (Use arrow keys)
❯ dar (default)
  stage
  kras
  local
  custom
```

Depending on your previous use of Fluence CLI, you may witness the installation of multiple dependencies possibly including the [Rust toolchain](https://www.rust-lang.org/) which may take a minute. Eventually, you should see a message similar to:

```bash
Successfully initialized Fluence CLI project template at <your path>/hello-world
```

`cd` into the directory and look around:

```bash
$ tree -L 2 -a
.
├── .fluence
│   ├── aqua
│   ├── aqua-dependencies
│   ├── env.yaml
│   ├── schemas
│   └── workers.yaml
├── .gitignore
├── .vscode
│   └── extensions.json
├── Cargo.lock
├── Cargo.toml
├── README.md
├── fluence.yaml
├── src
│   ├── aqua                 
│   ├── gateway               
│   └── services 
```

The *quickstart* template scaffolds our project with the basic components needed to develop and deploy your Cloudless Function. Specifically, the template scaffolds a Marine service (and a Gateway) section on top of the *minimal* template discussed earlier. For starters, the *quickstart* template created a `src/services/` directory and installed a Marine service template called myService (1).

```bash
$ tree -L 5 -a src/services
src/services
└── myService
    ├── modules
    │   └── myService         (1)
    │       ├── Cargo.toml
    │       ├── module.yaml
    │       └── src
    │           └── main.rs   (2)
    └── service.yaml

5 directories, 4 files
```

Upon closer inspection, we see that *myService* is comprised of one module, although a service may consist of multiple modules, with its module definition in the *module.yaml* file and the code in the main.rs file (2). With the exception of the yaml files, *myService* looks like a typical Rust project.

:::info
In Marine terminology, a service is a namespace over the Wasm artifacts consisting of modules and configuration files. Multiple Wasm modules can be linked but can only have a single (module) interface, called the facade module, as reflected in the service.yaml file. See the [Glossary](https://fluence.dev/docs/build/glossary#facade-module) for more information about modules and module types.
:::

In your editor or IDE, have a look at the `src/services/myService/modules/myService/src/main.rs` file:

```rust
     1	#![allow(non_snake_case)]
     2	use marine_rs_sdk::marine;                     (2)
     3	use marine_rs_sdk::module_manifest;
     4
     5	module_manifest!();
     6
     7	pub fn main() {}
     8
     9	#[marine]                                       (9)
    10	pub fn greeting(name: String) -> String {
    11	    format!("Hi, {}", name)
    12	}
```

For our quickstart purposes, lines 2 and 9 are the most pertinent. In line 2, we import the *marine macro* from the [marine_rs_sdk](https://crates.io/crates/marine-rs-sdk) crate. The SDK which builds on top of the [wasmtime](https://wasmtime.dev/) runtime to enable you to write performant, effective Fluence Compute Functions for Fluence's serverless Wasm runtime. For a comprehensive overview and deep dive into Marine, see the [Marine book](https://fluence.dev/docs/marine-book/introduction).  Suffice it to say that in order for methods, or structs, be callable from the outside, they need to be wrapped by the `#[marine]` (line 9) macro provided by the marine-rs-sdk.

Go ahead run `fluence build` to compile our code. You should see output similar to:

```bash
# Making sure all services are downloaded...
# Making sure all services are built...
   Compiling myService v0.1.0 (/Users/bebo/localdev/fluence-code/mvm-docs-code/hello-world/src/services/myService/modules/myService)
    Finished release [optimized] target(s) in 0.37s
```

When you look into the Rust *target** directory, specifically into the `target/wasm32-wasi/release` directory, you see the Wasm module `myService.wasm` created by compiling our Rust code in the myService service namespace.

```bash
ll target/wasm32-wasi/release|grep .wasm
-rwxr-xr-x@  1 bebo  staff    85K Jan  2 15:28 myService.wasm
```

Eventually, we'll deploy that module to the network as a Compute Function. Before we do that, lets quickly review testing options with respect to both local and remote environments. Running defective code in remote, distributed networks can be an expensive undertaking. Billing is commensurate with execution and a run-away service, for example, can be rather costly. Hence, testing is of utmost importance.

The Fluence toolchain supports interactive and non-interactive testing of your Fluence Functions using [Marine Repl](https://crates.io/crates/mrepl) or the [marine-rs-test-sdk](https://crates.io/crates/mrepl). For our purposes, we'll constrain ourself to the REPL. See the [testing section](./../how-to/test.md) for a comprehensive review of both tooling and strategy.

Back to the task at hand. We created some code, well, inherited it from the *quickstart* template, and compiled it to wasm32-wasi giving us the [Marine Service](./../glossary#marine-service) we want to deply to the network for future execution(s). But before we go to deploying our functions, we want to know if our *greeting* function actually works. For that we use the Marine REPL by calling `fluence service repl myService`. If you haven't used the REPL yet, the CLI will download and install it for you. Once the installation is complete, you should see something similar to this:

```bash
# Making sure service and modules are downloaded and built...
    Finished release [optimized] target(s) in 0.09s
# Downloading mrepl@0.24.0 binary to <your path>/.fluence/cargo/mrepl/0.24.0...


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Execute help inside repl to see available commands.
Current service <module_name> is: myService
Call myService service functions in repl like this:

call myService <function_name> [<arg1>, <arg2>]

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

}
Welcome to the Marine REPL (version 0.24.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 6179e0c3-e2ad-47b1-9cd5-0e5bb37da89e
elapsed time 27.941541ms

1>
```

Use the *help* command to see all your options but for now, enter *interface*:

```bash
1> interface
Loaded modules interface:
exported data types (combined from all modules):
<no exported data types>

exported functions:
myService:
  func greeting(name: string) -> string

2>
```

Remember when we wrapped the *greeting* functions with the `marine` macro to make the function callable? Well, here it is in the *myService* namespace (the template provided ) from our project scaffold. In order to use the function, we need to call it with the *call* command from its namespace:

```bash
2> call myService greeting ["Fluence"]
result: "Hi, Fluence"
 elapsed time: 2.609542ms

3>
```

Looks like our *greeting* function is working as intended. Try calling it with a parameter of a wrong type, e.g., an **int** or **float**, and check the error message.

To recap, we loaded our myService.wasm module into the REPl, identified our callable *greeting* function and called it. It's worth repeating that you didn't test the  *greeting* function code per se but the *greeting* function exposed by the Wasm module you created earlier. Don't forgot, if you make changes to your source code, you need to recompile it and load the new Wasm module into the REPL to see any changes. 

In addition to interactive testing with REPL, *cargo-based unit tests* are also available. For more information on creating Marine services, see the [Marine Book](https://fluence.dev/docs/marine-book/introduction).

Now that we are satisfied that our code is in working order, it's time to think about deployment. If you haven't set up your wallet with the necessary test tokens, see [Setting Up](./../setting-up).

We'll deploy to the `dar` testnet and just to make sure you are set up correctly, run:

```bash
$ fluence default env dar
```

which should return output similar to `Successfully set default fluence environment to dar`. Your `.fluence/env.yaml` content should reflect the `dar` testnet environment, i.e. you should see `fluenceEnv: dar`. 

The next steps are to parameterize the [Cloudless Distributive](./../glossary#cloudless-distributive) and [developer offer](./../glossary#developer-offer). All the offer-related parameterization is actually happening in the `fluence.yaml` file, which already includes the offer template with some default values.

```yaml
version: 8

deployments:                        (1)
  myDeployment:
    targetWorkers: 3
    pricePerWorkerEpoch: 0.00001
    initialBalance: 0.001
    services: [ myService ]
    spells: []

aquaDependencies:
  "@fluencelabs/aqua-lib": 0.9.1
  "@fluencelabs/spell": 0.6.9

services:
  myService:
    get: src/services/myService

relaysPath:
  - src/gateway/src

compileAqua:
  gateway:
    input: src/aqua
    output: src/gateway/src/compiled-aqua
    target: js
```

Let's focus on section (1), which is a list of deployments. In our case, we have only one deployment for our *myService* Marine service. 

* *targetWorkers*: specifies how many instances of Cloudless Deployment you want. If you are looking for high-availability, you should specify a larger number of workers, such as the three specified by default. 
* *pricePerWorkerEpoch*: specifies how much you are willing to pay for each worker per epoch in *tUSDC* and *USDC* for mainnet deployment. For development purposes, the duration of an epoch is defined as 15 seconds for the testnet and if your offer of USDC 0.0001 is accepted, you will be charged that amount per epoch per worker.  If your offer does not result in a match on the marketplace, you may want to look into the feasibility of your payment proposal. *Note that epoch-based pricing a temporary solution that will be replaced by request-based pricing in short order.* 
* *initialBalance*: This is the amount of USDC you are committing to seed your deployment. You can add or withdraw funds once the your offer was successfully matched on the marketplace. In this case, you can expect your deployment to be available for invocation for 10 epochs or 2.5 minutes. That should be enough to make sure that our Cloudless Deployment works as planned.
* *services* specifies which Marine services are part of the deployment. Note that you can include more than Marine service in your deployment as well as none assuming you have a *spell* to deploy.
* *spell*: specifies which Cloudless Scheduler service you want to deploy. See the [Cloudless Scheduler](./../how-to/schedule_functions.md) section for more information.

We have set up everything we need for the CLI to create and submit our offer to the marketplace and since our testnet providers are quite cooperative, there shouldn't be any problems getting your offer matched. Time to move to the deployment phase for which we use the `fluence deploy` command:

```bash
fluence deploy myDeployment
```

You'll see multiple lines of output:

```bash
$ fluence deploy myDeployment
Using dar blockchain environment
    Finished release [optimized] target(s) in 0.18s
Service memory limits for worker myDeployment:
myService: 2.00 GB

Connecting to random dar relay: /dns4/2-testnet.fluence.dev/tcp/9000/wss/p2p/12D3KooWHk9BjDQBUqnavciRPhAYFvqKBe4ZiPPvde7vDaqgn5er
Connected

Deploying myDeployment

To approve transactions to your wallet using metamask, open the following url:

https://cli-connector.fluence.dev/?wc=5270eac6c16c6e548352de5eca15da84e2578c100e29b91695931f3b8d8c8696%402&relay-protocol=irn&symKey=3e8ccf026bd1cef1de5d430be31f8c8ec157534aa852accb4e942039a294295f

or go to https://cli-connector.fluence.dev and enter the following connection string there:

wc:5270eac6c16c6e548352de5eca15da84e2578c100e29b91695931f3b8d8c8696@2?relay-protocol=irn&symKey=3e8ccf026bd1cef1de5d430be31f8c8ec157534aa852accb4e942039a294295f
```

You are now prompted to confirm the transaction. Copy the url into a browser tab and pretty soon you'll see your wallet, in our case MetaMask, pop up asking you to confirm the transaction. Make sure you selected the correct network and a tUSDC, tFLT funded account. Once the deployment offer is matched with one or more provider offers, 

Before we move on to actually and finally (!) use our compute functions, stop by [Blockscout](https://blockscout.dar.fluence.dev/) and checkout the details of the blockchain transaction (TX). You can check out the details of your offer and more using the [Cloudless Explorer](https://explorer.fluence.dev/) -- mae sure you select the `dar` network in the upper right corner.


Now that we've got our Cloudless Deployment in place with our compute function installed on three different peers, we are ready to orchestrate with Aqua. For all things Aqua, see the [Auqa Book](https://fluence.dev/docs/aqua-book/introduction).

Luckily, the quickstart template already provided us with a a nice set of Aqua scripts to explore an use. Have a look at the *auqa.main* file in the `src/aqua` directory and let's quickly review the most salient sections before we start executing:

```aqua
aqua Main                                   -- (1)

import "@fluencelabs/aqua-lib/builtin.aqua" -- (2a)
import "@fluencelabs/aqua-lib/subnet.aqua"  -- (2b)

use "deals.aqua"                            -- (3a) 
use "hosts.aqua"                            -- (3b)
import "services.aqua"                      -- (3c)

-- IMPORTANT: Add exports for all functions that you want to run
export helloWorld, helloWorldRemote, getInfo, getInfos

-- DOCUMENTATION:
-- https://fluence.dev



-- example of running services deployed using `fluence deploy`
-- with worker 'myDeployment' which has service 'MyService' with method 'greeting'

export runDeployedServices, showSubnet      -- (4)

data Answer:                                -- (5)
    answer: ?string
    worker: Worker

func runDeployedServices() -> []Answer:     -- (6)
    deals <- Deals.get()
    dealId = deals.myDeployment!.dealIdOriginal
    answers: *Answer
    on HOST_PEER_ID:
        subnet <- Subnet.resolve(dealId)
    if subnet.success == false:
        Console.print(["Failed to resolve subnet: ", subnet.error])

    for w <- subnet.workers:
        if w.worker_id == nil:
            answers <<- Answer(answer=nil, worker=w)
        else:
            on w.worker_id! via w.host_id:
                answer <- MyService.greeting("fluence")     -- (6a)
                answers <<- Answer(answer=?[answer], worker=w)

    <- answers

-- snip --
```

Before we run through the code, let's got for instant gratification and choreograph our *greeting* compute function. We use `fluence run` to invoke the `runDeployedServices`, (6), function to invoke all three of our distributed compute functions:

```bash
fluence run -f 'runDeployedServices()'
```

if you look in line (6a), you see that our distributed *greeting* functions are called with the *fluence* value
and our expectation might be that we get back three *Hello, fluence* strings. Let's check the response:

```bash
Running runDeployedServices() from /Users/bebo/localdev/local-0.15.9/src/aqua/main.aqua

[
  {
    "answer": "Hi, fluence",
    "worker": {
      "host_id": "12D3KooWHy6DowFR9n7MnKpywLm2MsfSyfZmxRKrbDC1sUXfrhhk",
      "pat_id": "0x0025af2a1309527cc3505637b3cbcb1e05cf96e0d7b65cb43e994e0ff97e5a1e",
      "worker_id": "12D3KooWDsorC8Vb5oVbUyjczKUttEcvpFBPjqyGbcQKBfBLuuRy"
    }
  },
  {
    "answer": "Hi, fluence",
    "worker": {
      "host_id": "12D3KooWKPTy4QDrWNFjEtDwdzyhvfv7TSu79PSUhkyVAPbug5tV",
      "pat_id": "0x0d434243f6dd6b70cae0488dbc09889b6c9f1870d6f80cefc6fbe0954f6e2711",
      "worker_id": "12D3KooWHphpX4TND7fPg5NE1y5TG1FUKfywtQ4BLSWY7z8w18o3"
    }
  },
  {
    "answer": "Hi, fluence",
    "worker": {
      "host_id": "12D3KooWRFyAVoaGBnpPfjgtmPrCg2dFjJ8jSspzNAxMVDk1rhUg",
      "pat_id": "0x017451419285266927091d2864bc4fe8c4c492fd6084e1095af713882588e91e",
      "worker_id": "12D3KooWKPGZJcvP7avSBpYfia1aaRXiCwaphE6g4dLF3rRqZeKB"
    }
  }
]
```

Alright, we hit pay dirt! Note that the *answer* key holds the compute function return string, whereas the *worker* key holds the worker information for each of the Cloudless Deployments.


Let's dig into the *main.aqua* file:

*  every aqua file needs a (named) header `aqua` (1)
*  imports are managed with 'import' and 'use' (2), where `use` allows you bring the file's namespace into your scope. See the [Aaqua book](https://fluence.dev/docs/aqua-book/language/header/)for more detail. The CLI scaffold already added the dependency requirements, (2a) and (2b), which support [Builtins](./../glossary#builtin-services) and [Subnet](./../glossary#subnet).
* CLI maintains aqua files, (3a),(3b) and (3c), in the `.file/aqua` directory that can be imported/used in your Aqua scripts saving you from typing a bunch of boilerplate:
 * (3a) contains the deployment information
 * (3c) contains the interface bindings for Aqua to be able to interact with the exposed Wasm methods of your compute function; in this case  *greeting*
* in order to be able to call an Aqua function, like *runDeployedServices*, the function needs to be exported (4)

Now, let's review the *runDeployedServices* function (6), line-by-line:

```aqua
func runDeployedServices() -> []Answer:
    deals <- Deals.get()                                  -- get the parameterized deal info from .fluence/aqua/deals.aqua
    dealId = deals.myDeployment!.dealIdOriginal           -- now we can ge the deal id we need to resolve subnetwork
    answers: *Answer                                      -- mutable stream variable of (5) data struct  
    on HOST_PEER_ID:                                      -- on this full, e.g., relay, peer
        subnet <- Subnet.resolve(dealId)                  -- get the subnet 
    if subnet.success == false:
        Console.print(["Failed to resolve subnet: ", subnet.error])

    for w <- subnet.workers:                              -- for each worker holding Cloudless Deployment
        if w.worker_id == nil:
            answers <<- Answer(answer=nil, worker=w)
        else:
            on w.worker_id! via w.host_id:
                answer <- MyService.greeting("fluence")    -- call the greeting function using using the interface definitions from services.aqua
                answers <<- Answer(answer=?[answer], worker=w)   -- pipe the function results into the streaming variable

    <- answers                                             -- return the streaming variable
```

For the most part, the lines through `subnet <- Subnet.resolve(dealId)` need to be implemented for your Aqua functions  needing to interact with your compute functions. If you are interested to see a little more information about your subnet, `fluence run -f 'showSubnet()'`.


