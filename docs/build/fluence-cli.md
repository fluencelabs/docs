# Fluence CLI

We'v built a new tool that makes it easier to work with Fluence

It can be installed using:

```sh
npm i -g @fluencelabs/cli
```

The documentation can be found [here](https://github.com/fluencelabs/fluence-cli#readme)

We didn't yet update the examples to use it, but you can try out the tool yourself for new projects

At this point the tool is a wrapper for:
- [rustup](https://rustup.rs/)
- [cargo](https://doc.rust-lang.org/stable/cargo/)
- [npm](https://docs.npmjs.com/cli)
- [marine](../marine-book/marine-tooling-reference/marine-cli)
- [mrepl](../marine-book/marine-tooling-reference/marine-repl)
- [aqua](../aqua-book/aqua-cli)

If you don't have cargo and rust installed in your environment - the tool will automatically install them and modify your environment. All the other dependencies are installed when they are needed, cached by version in the user's `~/.fluence` directory and do not modify your environment.

Fluence CLI simplifies dependency management and installation,
deployment and storage of keys and ids, generation of Aqua interfaces for Marine modules, etc.