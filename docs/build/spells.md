# Spells

Spells are actors in the Fluence Network designed to perform tasks with user business logic as well as maintenance jobs. 

Think of them as of automated jobs, that can be executed when some specific trigger event occurs (time, connection poll, http, blockchain events, etc).

Spells can be used for user-defined automation scenarios for service maintenance, periodical data extraction, subnet maintenance, etc. 

A spell is a [Marine](/docs/marine-book/introduction.md) service, that contain and execute AIR scripts. The main goal a spell service is to provide state storage for AIR script execution. It also provides some additional features to ease the spell usage for users and take some responsibility from the node (aka [Nox](https://github.com/fluencelabs/nox)). The service serves as a template and is instantiated on the creation of a new spell.

The Spell service is intended to be used as a template and instantiated by a node on each new spell creation.

## Managing spells
[Nox](https://github.com/fluencelabs/nox) provides user [API](https://github.com/fluencelabs/spell/blob/c3be0974bac507c5d3adfef9ff7b6e6b7511385b/src/aqua/spell/api.aqua#L7) for interacting with spells.

Users are able to control their spells' lifecycle: install new ones, update them, and remove them. The developer experience is provided by the means of [Fluence CLI](https://github.com/fluencelabs/cli). 

A spell consists of the following parts: 
- The spell script, which will be executed
- The list of trigger events (aka the trigger configuration) on which to run the spell
- The initial state of the spell (e.g. initial state of spell's KV storage)

After installation, the developer is able to update trigger configuration, and change the state of the KV storage.


Developer can check their spells' state: 
- inspect their internal state (the KV storage, the script, the trigger config)
- obtain their peer identity: spell_id and worker_id.

## Events that can trigger spells
[Nox](https://github.com/fluencelabs/nox) triggers spells according to their configuration. Currently Nox provides the following event triggers:
- Time-based: CRON-like, run spells at a specified time or within a specified period, for a specified amount of time.

Users should be able to specify the following:
- Time-based: CRON-like, run spells at a specified time or within a specified period, for a specified amount of time.
    - when begin running the spell,
    - how often should the script be run.
- Connection Triggers: run spells on connection/disconnection of some peers to the peer.

All other trigger types can be implemented based on the timer triggers & the spell KV storage (blockchain event trigger, database event trigger, HTTP event trigger, etc)

## Creating and updating spells

Spells can be created and managed with [Fluence CLI](https://github.com/fluencelabs/cli). 

Let's start from creating a new project with `fluence init` , which gives us a couple scaffolding choices:
```bash
fluence init
? Select template (Use arrow keys)
❯ quickstart
  minimal
  ts
  js
```

Press return to select the default quickstart scaffolding option and enter *quickstart* as the project path when prompted:
```bash
? Enter project path or press enter to init in the current directory: quickstart
Successfully initialized Fluence project template at /tmp/quickstart
```

Now let's create a new spell in a recently scaffolded Fluence CLI project by running `fluence spell new`:
```bash
quickstart $ fluence spell new
? Enter spell name 1min_spell
Successfully generated template for new spell at /tmp/quickstart/src/spells/1min_spell
? Do you want to add spell 1min_spell to a default worker defaultWorker Yes
Added 1min_spell to defaultWorker
```

Lets check what have been generated: a new spell directory was created under src/spells - 1min_spell:
```bash
.
└── 1min_spell
    ├── spell.aqua
    └── spell.yaml
```

It contains [Aqua](/docs/aqua-book/introduction.md) script that will be executed and the [spell.yaml](https://github.com/fluencelabs/cli/blob/b8d6c5b9476962805a7fcf6bcc0cfb171089c584/docs/configs/spell.md) file that specifies the trigger configuration for the spell.

If we take a look at the `spell.aqua` file we see the `spell()` function that is executed when the spell is triggered:
```aqua
import Op, Debug from "@fluencelabs/aqua-lib/builtin.aqua"
import Spell from "@fluencelabs/spell/spell_service.aqua"

func spell():
    msg = "Spell is working!"
    str <- Debug.stringify(msg)
    Spell "worker-spell"
    Spell.list_push_string("logs", str)
```

Lets modify it a bit, so that we could redirect the spell logs can be viewed though `fluence deal logs` command:
```aqua
import Op, Debug from "@fluencelabs/aqua-lib/builtin.aqua"
import Spell from "@fluencelabs/spell/spell_service.aqua"
func spell():
    msg = "Spell is working!"
    str <- Debug.stringify(msg)
    Spell "self"
    -- also it can be resolved by Spell "spell"
    Spell.set_string("my_key", str)
    -- then we will log the same message to installation-spell, so it is discoverable through the CLI's `fluence deal logs` command
    Spell "worker-spell"
    Spell.store_log(str)
```

After that let's also modify the main.aqua file to define a helper function for getting the keys into the spell KV storage:
```aqua
aqua Main

import Console, Debug from "@fluencelabs/aqua-lib/builtin.aqua"
import "@fluencelabs/aqua-lib/subnet.aqua"
import Spell from "@fluencelabs/spell/spell_service.aqua"

use "deals.aqua"

export get_my_keys

func get_my_keys() -> []string:
    deals <- Deals.get()
    dealId = deals.defaultWorker!.dealIdOriginal
    results: *string
    on HOST_PEER_ID:
        subnet <- Subnet.resolve(dealId)
    if !subnet.success:
        Console.print(["Failed to resolve subnet: ", subnet.error])

    for w <- subnet.workers:
        if w.worker_id != nil:
            on w.worker_id! via w.host_id:
                Spell "1min_spell"
                res <- Spell.get_string("my_key")
                results <- Debug.stringify([res.str, "on worker ", w.worker_id!, " on host ", w.host_id])

    <- results

``` 

Then let's inspect the spell.yaml file:
```yaml
version: 0

aquaFilePath: ./spell.aqua

function: spell # name of the function from spell.aqua (set in aquaFilePath) to be executed

clock:
  periodSec: 60
  endDelaySec: 1800
```

It contains the definition of the spell, the name of function in `aquaFilePath` aqua file that is triggered (in case if you don't like the default name), and the cron-ish timer based trigger configuration.

- `periodSec` defines how often the spell will be executed. If set to 0, the spell will be executed only once. If this value is not provided, the spell will never be executed.
- `endDelaySec` defines how long to wait before the last execution in seconds. If this property or `endTimestamp` is not specified, periodic execution will never end.

:::info
Your computer's clock is used to determine a final timestamp sent to the server. If it is in the past at the moment of spell creation - the spell will never be executed. This property conflicts with `endTimestamp`. You can specify only one of them.
:::

More on the spell.yaml contents can be found in:
Documentation: https://github.com/fluencelabs/cli/tree/main/docs/configs/spell.md 

## Deploying the spell

So, now we've configured our spell to run every minute, so lets try to deploy it by doing `fluence deal deploy`. 

**Please note that the deployment process requires some preparation (set up Metamask, get some testnet tokens, etc). You can find more details in the [Getting Started Guide](/docs/build/get-started.md).**

After the deal is deployed, you can check that the spell is working:

```bash
fluence run -f "get_my_keys()"
Connecting to kras relay: /dns4/8-kras.fluence.dev/tcp/9000/wss/p2p/12D3KooWEFFCZnar1cUJQ3rMWjvPQg6yMV2aXWs2DkJNSRbduBWn
Connected
[
  "[\"\\\"Spell is working!\\\"\",\"on worker \",\"12D3KooWMaEjJ7ren3JvVgAtrzm6aPPtSZMPTcQu8wD9wZ5krQe5\",\" on host \",\"12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e\"]",
  "[\"\\\"Spell is working!\\\"\",\"on worker \",\"12D3KooWPkUpq6U2FpMbviNystGD7qmPa9yM8oR2dv1WkAd4jtkW\",\" on host \",\"12D3KooWR4cv1a8tv7pps4HH6wePNaK6gf1Hww5wcCMzeWxyNw51\"]",
  "[\"\\\"Spell is working!\\\"\",\"on worker \",\"12D3KooWSY8ZFEoAXmHYkYheSRcDB7FwmtmNz8iHYmZjcArDYhmc\",\" on host \",\"12D3KooWHLxVhUQyAuZe6AHMB29P7wkvTNMn7eDMcsqimJYLKREf\"]"
]
```
You can also check the logs by running `fluence deal logs`.

## Updating the spell

If you want to change the spell script or spell definition -- you should change the corresponding files and run `fluence deal deploy` once again to update the spell. The deployment process is described in the [Getting Started Guide](/docs/build/get-started.md).

## Removing the spell

Spell removal is not implemented yet, but will be possible in future releases. 

# Reference Link

- [Spell repository on GitHub](https://github.com/fluencelabs/spell)

