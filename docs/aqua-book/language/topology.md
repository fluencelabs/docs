---
description: Define where the code is to be executed and how to get there
---

# Topology

Aqua lets developers describe the whole distributed workflow in a single script, link data, recover from errors, implement complex patterns like back pressure, and more. Hence, the network topology is at the heart of Aqua.

Topology in Aqua is declarative: You just need to say where (on what peer) a piece of code must be executed, and optionally how to get there. The Aqua compiler will add all the required network hops.

## `on` expression

`on` expression moves execution to the specified peer:

```aqua
on "my peer":
  foo()
```

Here, `foo` is instructed to be executed on a peer with id `my peer`. Peer in `on` expression could be specified with variable of type `string`:

```aqua
-- foo, bar, baz are instructed to be executed on myPeer
on myPeer:
  foo()
  bar()
  baz()
```

:::danger
`on` does not add network hops on its own: if there are no service calls inside the `on` scope, the node will not be reached. Use `via` to affect the topology without service calls.
:::

For example, peer `myPeer` would not be reached in an execution of the next code snippet:

```aqua
on myPeer:
  -- There are no calls in this scope,
  -- so `myPeer` is not reached
  on myOtherPeer:
    -- `foo` is executed on `myOtherPeer`
    foo()
```

Note also that execution is not obligated to return to previous peer with `on` scope closing. For example, in the next code snippet possible network hops are `myPeer -> myNextPeer -> myLastPeer`:

```aqua
on myPeer:
  -- `foo` is executed on `myPeer`
  foo()
  on myNextPeer:
    -- `bar` is executed on `myNextPeer`
    bar()
  -- There are no calls here,
  -- so no need to return to `myPeer`
  -- We go directly to `myLastPeer`
  on myLastPeer:
    -- `baz` is executed on `myLastPeer`
    baz()
```

Such an optimization could be done in more complex scenarios too. For example:
```aqua
on myPeer:
  -- `foo` is executed on `myPeer`
  foo()
  on myNextPeer:
    -- `bar` is executed on `myNextPeer`
    bar()
-- Execution here transfers directly
-- from `myNextPeer` to `myLastPeer`
on myLastPeer:
  -- `baz` is executed on `myLastPeer`
  baz()
```

## `INIT_PEER_ID`

There is one custom peer ID that is always in scope: `INIT_PEER_ID`. It points to the peer that initiated this request.

:::caution
Using `on INIT_PEER_ID` is an anti-pattern: There is no way to ensure that init peer is accessible from the currently used part of the network.
:::

## `HOST_PEER_ID`

This constant is resolved on compilation time to point on the relay (the host the client is connected to) if Aqua is compiled to be used behind the relay (default mode, targets web browsers and other devices that needs a relay to receive incoming connections), and on `INIT_PEER_ID` otherwise.

## More complex scenarios

Consider this example:

```aqua
func foo():
  on "peer foo":
    do_foo()

func bar(i: i32):
  do_bar()

func baz():
  bar(1)
  on "peer baz":
    foo()
    bar(2)
  bar(3)
```

Take a minute to think about:

* Where is `do_foo` executed?
* Where is `bar(1)` executed?
* On what node `bar(2)` runs?
* What about `bar(3)`?

Declarative topology definition always works the same way.

* `do_foo` is executed on `"peer foo"`, always.
* `bar(1)` is executed on the same node where `baz` was running. If `baz` is the first called function, then it's `INIT_PEER_ID`.
* `bar(2)` is executed on `"peer baz"`, despite the fact that foo does topological transition. `bar(2)` is in the scope of `on "peer baz"`, so it will be executed there.
* `bar(3)` is executed where `bar(1)` was: in the root scope of `baz`, wherever it was called from.

## Accessing peers `via` other peers

In a distributed network it is quite common that a peer is not directly accessible. For example, a browser has no public network interface and you cannot open a socket to a browser at will. Such constraints warrant a `relay` pattern: there should be a well-connected peer that relays requests from a peer to the network and vice versa.

Relays are handled with `via`:

```aqua
-- When we go to some peer from some other peer,
-- the compiler will add an additional hop to some relay
on "some peer" via "some relay":
  foo()

-- More complex path: first go to relay2, then to relay1,
-- then to peer. When going out of peer, do it in reverse  
on "peer" via relay1 via relay2:
  foo()

-- You can pass any collection of strings to relay,
-- and it will go through it if it's defined,
-- or directly if not  
func doViaRelayMaybe(peer: string, relayMaybe: ?string):
  on peer via relayMaybe:
    foo()
```

`on`s nested or delegated in functions work just as you expect:

```aqua
-- From where we are, -> relay1 -> peer1
on "peer1" via "relay1":
  -- On peer1
  foo()
  -- now go -> relay1 -> relay2 -> peer2
  -- going to relay1 to exit peer1
  -- going to relay2 to enable access to peer2
  on "peer2" via "relay2":
    -- On peer2
    foo()
-- This is executed in the root scope, after we were on peer2
-- How to get there?
-- Compiler knows the path that just worked
-- So it goes -> relay2 -> relay1 -> (where we were)
foo()
```

With `on` and `on ... via`, significant indentation changes the place where the code will be executed, and paths that are taken when execution flow "bubbles up" (see the last call of `foo`). It's more efficient to keep the flow as flat as it could. Consider the following change of indentation in the previous script, and how it affects execution:

```aqua
-- From where we are, -> relay1 -> peer1
on "peer1" via "relay1":
  -- On peer1
  foo()
-- now go -> relay1 -> relay2 -> peer2
-- going to relay1 to exit peer1
-- going to relay2 to enable access to peer2
on "peer2" via "relay2":
  -- On peer2
  foo()
-- This is executed in the root scope, after we were on peer2
-- How to get there?
-- Compiler knows the path that just worked
-- So it goes -> relay2 -> (where we were)
foo()
```

When the `on` scope is ended, it does not affect any further topology moves. Until you stop indentation, `on` affects the topology and may add additional topology moves, which means more roundtrips and unnecessary latency.

## Callbacks

What if you want to return something to the initial peer? For example, implement a request-response pattern. Or send a bunch of requests to different peers, and render responses as they come, in any order.

This can be done with callback arguments in the entry function:

```aqua
func run(updateModel: Model -> (), logMessage: string -> ()):
  on "some peer":
    m <- fetchModel()
    updateModel(m)
  par on "other peer":
    x <- getMessage()
    logMessage(x)
```

Callbacks have the [arrow type](types.md#arrow-types).

If you pass just ordinary functions as arrow-type arguments, they will work as if you hardcode them.

```aqua
func foo():
  on "peer 1":
    doFoo()

func bar(cb: -> ()):
  on "peer2":
    cb()

func baz():
  -- foo will go to peer 1
  -- bar will go to peer 2
  bar(foo)
```

If you pass a service call as a callback, it will be executed locally on the node where you called it. That might change.

Functions that capture the topological context of the definition site are planned, not yet there. **Proposed** syntax:

```aqua
func baz():
  foo = do (x: u32):
    -- Executed on the peer calling foo
    Srv.call(x)
    <- x
  -- When foo is called, it will get back to this context
  bar(foo)
```

[Issue for adding `do` expression](https://github.com/fluencelabs/aqua/issues/183)

:::caution
Passing service function calls as arguments is very fragile as it does not track that the service is resolved in the scope of the call. Abilities variance may fix that.
:::

## Parallel execution and topology

When blocks are executed in parallel, it is not always necessary to resolve the topology to get to the next peer. The compiler will add topological hops from the par branch only if data defined in that branch is used down the flow.

:::danger
What if all branches do not return? Execution will halt. Be careful, use `co` if you don't care about the returned data.
:::
