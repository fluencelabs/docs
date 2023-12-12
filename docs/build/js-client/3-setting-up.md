# Setting up project

## CLI install

The best way to initialize the project is by using CLI

> You can find an installation guide [here](https://github.com/fluencelabs/cli).

Run the command below and follow instruction.

```sh
fluence init -t=ts --env=kras 
```

Go to `src/frontend` dir and run `npm install`.

Place aqua files in `src/aqua` and compile them via `fluence aqua` command

### Node.JS

The command above creates a frontend project.

If you want to run JS client in Node.js, remove all frontend related files and deps.

In that case, recommended way to run index.ts file via `node --loader ts-node/esm index.ts`.

> Remember to do `npm install -D ts-node` if you want to use command above