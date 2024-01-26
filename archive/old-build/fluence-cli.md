# Fluence CLI

Fluence CLI is intended to be the only tool that you need to manage the lifecycle of applications written on Fluence. It provides project scaffolding, compilation, service deployment, dependency management and installation, storage of keys and ids, etc.

You can install Fluence CLI by running:

```sh
npm i -g @fluencelabs/cli
```

:::info
We will be updating [Quickstart](./quick-start) and [examples](https://github.com/fluencelabs/examples) to use Fluence CLI but for now you can try using it following instructions in the [README of Fluence CLI repository](https://github.com/fluencelabs/fluence-cli#readme)
:::

At this point Fluence CLI consolidates some of the functionality of lower level tools such as:
- [aqua](../aqua-book/aqua-js-api.md)
- [marine](../marine-book/marine-tooling-reference/marine-cli)
- [mrepl](../marine-book/marine-tooling-reference/marine-repl)
- [rustup](https://rustup.rs/)
- [cargo](https://doc.rust-lang.org/stable/cargo/)
- [npm](https://docs.npmjs.com/cli)

If you don't have cargo and rust installed in your environment - the tool will automatically install them and modify your environment. All the other dependencies are installed when they are needed, cached by their version in the user's `~/.fluence` directory and do not modify your environment.
