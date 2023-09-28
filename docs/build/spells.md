# Spells

Spells are actors in the Fluence Network designed to perform tasks with user business logic as well as maintenance jobs. 

Think of them as of automated jobs, that can be executed when some specific trigger event occurs (time, connection poll, http, blockchain events, etc).

:::info
Older implementation of Fluence had Scheduled Scripts, stateless AIR scripts which were periodically run by the node. There had rather restricted use cases since:
- they were stateless
- they could be triggered only by a timer
- they were working on behalf of the node
- they couldn’t communicate with each other
- they didn’t have a good management interface

Spells are basically Scheduled Scripts done ~~right~~ better.
:::

Spells can be used for user-defined automation scenarios for service maintenance, periodical data extraction, subnet maintenance, etc. 

A spell is a marine service, the main goal of which is to provide state storage for script execution. It also provides some additional features to ease the spell usage for users and take some responsibility from the node (aka Nox). The service serves as a template and is instantiated on the creation of a new spell.

This service is intended to be used as a template and instantiated by a node on each new spell creation.

## Managing spells
Nox provides user API for interacting with spells.

Users are able to control their spells' lifecycle: install new ones, update them, and remove them. The developer experience is provided by the means of Fluence CLI. 

Installing spells include providing the following: 
- The spell script, which will be executed
- The list of trigger events (aka the trigger configuration) on which to run the spell
- The initial state of the spell (e.g. initial state of spell's KV)

After installation, the developer is able to update the initial settings: the script, the trigger configuration, and the state KV storage.

Also, the developer is able to remove their spells, cleaning the state from the peer.

Users can check their spells' state: 
- inspect their internal state (the KV storage, the script, the trigger config)
- check if they’re currently subscribed to some triggers
- obtain their peer identity: spell_id and worker_id.

## Events that can trigger spells
Nox triggers spells according to their configuration. Currently Nox provides the following event triggers:
- Timer/CRON Triggers: run spells at a specified time or within a specified period.
Users should be able to specify the following:
    - when to run the spell,
    - when to unsubscribe the spell from timer events,
    - with what period to run the spell.
- Connection Triggers: run spells on connection/disconnection of some peers to the peer.

All other trigger types can be implemented based on the timer triggers & the spell KV storage (blockchain event trigger, database event trigger, HTTP event trigger, etc)

## Creating and updating spells

Spells can be created and managed with Fluence CLI. 

Let's create a new spell in a recently scaffolded Fluence CLI project by running `fluence spell new`:
```bash
quickstart $ fluence spell new
? Enter spell name 5min_spell
Successfully generated template for new spell at /Users/arete/Documents/fluence/quickstart/src/spells/1min_spell
? Do you want to add spell 5min_spell to a default worker defaultWorker Yes
Added 1min_spell to defaultWorker
```

Lets check what have been generated:
- a new spell directory was created under src/spells -- 5min_spell:
```bash
.
└── 1min_spell
    ├── spell.aqua
    └── spell.yaml
```

It contains aqua script that will be executed and the spell.yaml file that specifies the trigger configuration for the spell.

If we take a look at the spell.aqua file we see the `spell()` function that is executed when the spell is triggered:
```aqua
import Op, Debug from "@fluencelabs/aqua-lib/builtin.aqua"
import Spell from "@fluencelabs/spell/spell_service.aqua"

func spell():
    msg = "Spell is working!"
    str <- Debug.stringify(msg)
    Spell "worker-spell"
    Spell.list_push_string("logs", str)
```

Then lets inspect the spell.yaml file:
```yaml
# yaml-language-server: $schema=../../../.fluence/schemas/spell.json

# Defines a spell. You can use `fluence spell new` command to generate a template for new spell

# Documentation: https://github.com/fluencelabs/cli/tree/main/docs/configs/spell.md

version: 0

aquaFilePath: ./spell.aqua

function: spell

clock:
  periodSec: 60
  endDelaySec: 1800
```

It contains the definition of the spell, the name of function that is triggered (in case if you don't like the default name), and the cron-ish timer based trigger configuration.

`periodSec` - How often the spell will be executed. If set to 0, the spell will be executed only once. If this value not provided at all - the spell will never be executed.

and `endDelaySec` How long to wait before the last execution in seconds. If this property or endTimestamp not specified, periodic execution will never end. WARNING! Currently your computer's clock is used to determine a final timestamp that is sent to the server. If it is in the past at the moment of spell creation - the spell will never be executed. This property conflicts with endTimestamp. You can specify only one of them.

More on the spell.yaml contents can be found in:
Documentation: https://github.com/fluencelabs/cli/tree/main/docs/configs/spell.md 

## Deploying the spell

So, now we've configured our spell to run every minute, so lets try to deploy it by doing `fluence deal deploy`. After the deal is deployed, you can check that the spell is working by running `fluence deal logs`.

## Updating the spell

If you want to change the spell script or spell definition -- you should change the corresponding files and run `fluence deal deploy` once again to update the spell.

## Removing the spell

If you want to remove the spell from the node, you should remove the spell definition from the project and run  `fluence deal deploy` to redeploy the workers. This will remove the spell from the subnet and unsubscribe it from all triggers.

