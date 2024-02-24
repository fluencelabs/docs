# Your First Cloudless Function

In this section we pickup where we left off in the [Getting Started](../overview/getting_started.md) section and dive right back into the *Hello World* example. You can continue to use the FLuence CLI project you created earlier or create a new one. Let's create new project. 

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

Depending on your previous use of, or lack thereof, Fluence CLI, you may witness the installation of multiple dependencies possibly including the [Rust toolchain](https://www.rust-lang.org/) which may take a minute. Eventually, you should see a message similar to:

```bash
Successfully initialized Fluence CLI project template at <your path>/hello-world
```

`cd` into the directory and look around a bit:

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

The *quickstart* template scaffolds out project with the basic components needed to develop and deploy your Cloudless Function. Specifically, the template scaffolds a Marine service (and a Gateway) section on top of the *minimal* template discussed earlier. For starters, the *quickstart* template created a `src/services/` directory and installed a Marine service template called myService (1).

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

Upon closer inspection, we see that *myService* is comprised of one module, although a service may const of multiple modules, with its module definition in the *module.yaml* file and the code in the main.rs file (2). With the exception of the yaml files, *myService* looks like a typical Rust project.

:::info
In Marine terminology, a service is a namespace over the Wasm artifacts consisting of  modules and configuration files. Multiple Wasm modules can be linked but can only have a single (module) interface, called the facade module as reflected in the service.yaml file. See the [Glossary](https://fluence.dev/docs/build/glossary#facade-module) for more information about modules and module types.
:::

In your editor or IDE, have a look at the `src/services/myService/modules/myService/src/main.rs` file:

```rust
     1	#![allow(non_snake_case)]
     2	use marine_rs_sdk::marine;
     3	use marine_rs_sdk::module_manifest;
     4
     5	module_manifest!();
     6
     7	pub fn main() {}
     8
     9	#[marine]
    10	pub fn greeting(name: String) -> String {
    11	    format!("Hi, {}", name)
    12	}
```

For our quickstart purposes, lines 2 and 9 are the most pertinent. In line 2, we import the *marine macro* from the [marine_rs_sdk](https://crates.io/crates/marine-rs-sdk) crate. The SDK which builds on top of the [wasmtime](https://wasmtime.dev/) runtime to enable you to write performant, effective Fluence Compute Functions for Fluence's serverless Wasm runtime. For a comprehensive overview and deep dive into Marine, see the [Marine book](https://fluence.dev/docs/marine-book/introduction).  Suffice it to say that in order for methods, or structs, be callable from the outside, they need to be wrapped by the `#[marine]` (line 9) macro provided by the marine-rs-sdk.

Go ahead run `fluence build` to recompile our code. You should see output similar to:

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

The Fluence toolchain supports interactive and non-interactive testing of your Fluence Functions using [Marine Repl](https://crates.io/crates/mrepl) or the [marine-rs-test-sdk](https://crates.io/crates/mrepl). For our purposes, we'll constrain ourself to the REPL. See the [testing section](../how-to/test.md) for a comprehensive review of both tooling and strategy.

Back to the task at hand. We created some code, well, inherited it from the *quickstart* template, and compiled it to wasm32-wasi. So now what? Well, before we do anything else, we want to know if our *greeting* function works. For that we use the Marine REPL by calling `fluence service repl myService`. If you haven't used the REPL yet, the CLI will download and install it for you. Once the installation is complete, you should see something similar to this:

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

Just to recap, we loaded our myService.wasm module into the REPl, identified our callable *greeting* function and called it. Don't forgot, if you make changes to your source code, you need to recompile it and load the new Wasm module into the REPL to see any changes.

Now that we are satisfied that our code is in working order, it's time to think about deployment. If you haven't set up your wallet with the necessary test tokens, see [Setting Up](../setting-up/).

We'll deploy to the `dar` testnet and just to make sure you are set up correctly, run:

```bash
$ fluence default env dar
```

which should return output similar to `Successfully set default fluence environment to dar`. Your `.fluence/env.yaml` content should reflect the `dar` testnet environment, i.e. you should see `fluenceEnv: dar`. 

The next steps are to parameterize the [Cloudless Distributive](../glossary.md/#cloudless-distributive) and [developer offer](../glossary.md/#developer-offer). All this is actually happening in the `fluence.yaml` file, which already includes the dtritributive and off templates with some default values.

```yaml
version: 8

deployments:                        (1)
  myDeployment:
    targetWorkers: 1
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

For our purposes, let's focus on the the deployment (1) section which is a list of deployments. In our case, we have only one deployment for our *myService* Marine service. 

* *targetWorkers*: specifies how many instances of Cloudless Deployment you want. If you are looking for high-availability, you should specify a larger number of workers.
* *pricePerWorkerEpoch*: specifies how much you are willing to pay for each worker per epoch in *tUSDC* and *USDC* for mainnet deployment. For development purposes, the duration of an epoch is defined as 15 seconds for the testnet and if your offer of USDC 0.0001 is accepted, you will be charged that amount per epoch per worker.  If your offer does not result in a match on the marketplace, you may want to look into the feasibility of your payment proposal. *Note that epoch-based pricing a temporary solution that will be replaced by request-based pricing in short order. 
* *initialBalance*: This is the amount of USDC you are committing to seed your deployment. You can add or withdraw funds once the your offer was successfully matched on the marketplace. In this case, you can expect your deployment to be available for invocation for 10 epochs or 2.5 minutes. That should be enough to make sure that our Cloudless Deployment works as planned.
* *services* specifies which Marine services are part of the deployment. Note that you can include more than Marine service in your deployment as well as none assuming you have a *spell* to deploy.
* *spell*: specifies which Cloudless Scheduler service you wan to deploy. See the [Cloudless Scheduler](../how-to/schedule_functions.md) section for more information.

We have now set up everything we need for the CLI to create and submit our offer to the marketplace and since out testnet providers are quite cooperative, there shouldn't be any problems getting this offer matched. Time to move to the deployment phase for which we use the `fluence deploy` command:

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

You are now prompted to confirm the transaction. Copy the url into a browser tab and you'll see your wallet, in our case MetaMask pop up asking you to confirm the transaction. Make sure you selected the correct network and tUSDC, tFLT funded account.



Now that we've got our Cloudless Deployment in place with our compute function installed on one peer, we are ready to orchestrate with Aqua. For all things Aqua, see the [Auqa Book](https://fluence.dev/docs/aqua-book/introduction).

Luckily, the quickstart template already provided us with a a nice set of Aqua scripts to explore an use. Have a look at the *auqa.main* file in the `src/aqua` directory and let's quickly review the most salient sections before we start executing:

```haskell
aqua Main                                     (1)

import "@fluencelabs/aqua-lib/builtin.aqua"   (2a)
import "@fluencelabs/aqua-lib/subnet.aqua"    (2b)

use "deals.aqua"                              (3a) 
use "hosts.aqua"                              (3b)
import "services.aqua"                        (3c)

-- IMPORTANT: Add exports for all functions that you want to run
export helloWorld, helloWorldRemote, getInfo, getInfos

-- DOCUMENTATION:
-- https://fluence.dev



-- example of running services deployed using `fluence deploy`
-- with worker 'myDeployment' which has service 'MyService' with method 'greeting'

export runDeployedServices, showSubnet

data Answer:
    answer: ?string
    worker: Worker

func runDeployedServices() -> []Answer:
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
                answer <- MyService.greeting("fluence")
                answers <<- Answer(answer=?[answer], worker=w)

    <- answers

<snip>
```


From the top, every aqua file needs a (named) header `aqua`. Imports are amanged with 'import' and 'use',
where `use` allows you bring the file's namespace into your scope. See the [Aaqua book](https://fluence.dev/docs/aqua-book/language/header/)for more detail.

