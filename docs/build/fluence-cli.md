# Fluence CLI

Fluence CLI is a tool that simplifies building applications on Fluence. It helps scaffolding, compiling and deploying projects and managing deployments.

You can install Fluence CLI by running:

```sh
npm i -g @fluencelabs/cli
```

:::info
We will be updating [Quickstart](./quick-start/quick-start) and [examples](https://github.com/fluencelabs/examples) to use Fluence CLI but for now you can try using it following instructions in the [README of Fluence CLI repository](https://github.com/fluencelabs/fluence-cli)
:::

At this point the tool is a wrapper for:
- [rustup](https://rustup.rs/)
- [cargo](https://doc.rust-lang.org/stable/cargo/)
- [npm](https://docs.npmjs.com/cli)
- [marine](../marine-book/marine-tooling-reference/marine-cli)
- [mrepl](../marine-book/marine-tooling-reference/marine-repl)
- [aqua](../aqua-book/aqua-cli)

If you don't have cargo and rust installed in your environment - the tool will automatically install them and modify your environment. All the other dependencies are installed when they are needed, cached by their version in the user's `~/.fluence` directory and do not modify your environment.

Fluence CLI also simplifies dependency management and installation, storage of keys and ids, generation of Aqua interfaces for Marine modules, etc.
