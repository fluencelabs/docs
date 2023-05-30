# Language

Aqua is a language for distributed workflow coordination in p2p networks.

It's structured with significant indentation:
- Tabs and spaces are allowed simultaneously
- Indentation of a parent block should be a strict prefix of indentation of a child block
- First line in a block defines indentation and all consequent lines should have the same indentation

```aqua
-- Comments begin with double-dash and end with the line (inline)
func foo(): -- Comments are allowed almost everywhere
  -- Body of the block expression is indented
  bar(5)
```

Values in Aqua have types, which are designated by a colon, `:`, as seen in the function signature below. The type of a return, which is yielded when a function is executed, is denoted by an arrow pointing to the right `->` , whereas yielding is denoted by an arrow pointing to the left `<-`.

```aqua
-- Define a function that yields a string
func bar(arg: i16) -> string:
  -- Call a function
  someFunc(arg)

  -- Yield a value from a function
  x <- someFunc(arg)

  -- Return a yielded results from a function
  <- "return literal"
```

Subsequent sections explain the main parts of Aqua.

Data:

* [Types](types.md)
* [Values of that types](values.md)

Execution:

* [Topology](topology.md) – how to express where the code should be executed
* [Execution flow](flow/flow.md) – control structures

Computations:

* [Abilities & Services](abilities-and-services.md)

Advanced parallelism:

* [CRDT Streams](crdt-streams.md)

Code management:

* [Imports & exports](header/header.md)

Reference:

* [Expressions](expressions/expressions.md)
