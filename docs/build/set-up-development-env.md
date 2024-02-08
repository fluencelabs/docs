# Set Up Development Environment

For developing on Fluence we recommend using [Fluence CLI](https://github.com/fluencelabs/fluence-cli)

The best way to make sure everything works for you is to ensure all the versions of Fluence Protocol parts match each other. Most importantly the version of Fluence CLI that you currently use must be compatible with the version of Nox that you trying to connect to

## Keeping Fluence CLI Up-To-Date

This is the first and the most important step that can help you ensure version compatibility. Use `fluence update` command to update Fluence CLI. Allowed arguments for this command are:

- `kras` - version compatible with current kras environment
- `testnet` - version compatible with current testnet environment
- `stage` - version compatible with current stage environment
- `main` - latest build from main branch
- `unstable` - latest release of Fluence CLI

So please run `fluence update kras` before running any CLI commands on `kras` environment. You can select environment by using `--env` flag or by running `fluence default env kras` inside your Fluence Project

Fluence CLI contains hardcoded versions of all the parts of Fluence Protocol that were tested to work together correctly. This means that if you work with local Fluence Network — generally speaking everything should just be working for you. The only thing to worry about is that you might have some dependency versions specified in `fluence.yaml` config of your Fluence Project that don't match with your current CLI version. To reset the versions of these dependencies to default, run:

```sh
fluence dep r
```

It's not required, but you might want to run this command each time you update CLI to a different version, to ensure compatibility

For advanced users: you can also run `fluence dep v` to check out all these versions for yourself

## Fluence CLI dependencies

### Aqua

To install you project aqua dependencies, run:

```sh
fluence dep i
```

You can install specific aqua dependencies like this:

```sh
fluence dep i @fluencelabs/aqua-lib@0.9.1
```

To uninstall specific aqua dependencies run this:

```sh
fluence dep un @fluencelabs/aqua-lib
```

You can also edit `fluence.yaml` directly and run `fluence dep i` after that

For advanced users: Aqua compiler currently relies on [npm](https://www.npmjs.com/) under the hood, to serve as it's package manager. This can change in the future. But currently, if you have any problems please refer to [npm documentation](https://docs.npmjs.com/). Please keep in mind that you don't need to separately install `npm` on your computer, because a specific version of npm is already included inside Fluence CLI itself

### Rust

Fluence CLI will attempt to install Rust for you on Linux and macOS. If you are on Windows or CLI is unable to install Rust, please refer to the [official Rust documentation for installation instructions](https://www.rust-lang.org/tools/install)

Fluence CLI will also automatically install the required Rust toolchain and add `wasm32-wasi` target

### Marine and Mrepl

You will need these to build and test services written in Rust. They will be lazily downloaded from GitHub releases when they are needed. But you can also force the download by running

```sh
fluence dep i
```

For advanced users: you can override marine and mrepl version in your project using `marineVersion` and `mreplVersion` properties in `fluence.yaml`. If for some reason download fails — Fluence CLI will attempt to build marine and mrepl from source using cargo 

### Docker

You will need that if you want to work with a local Fluence Network. We recommend to install Docker Desktop for yor OS using [official Docker documentation](https://docs.docker.com/desktop/). Don't forget to run docker after installation, before you attempt to set up local Fluence Network using `fluence local up`
