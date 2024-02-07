# Setting up project

### Intro

The instruction below will guide you through the process of setting up an environment for JS client.

> Created structure could look intimidating for a simple project, but its battle tested and extensible if the need arises. 

### Setting up for frontend

The best way to initialize the project is by using CLI

You can find an installation guide for the [Fluence CLI](https://github.com/fluencelabs/cli?tab=readme-ov-file#installation-and-usage).

Run the command below. The command will create `js-example` folder with the structured project.

```sh
fluence init -t ts --env kras js-example
```

Time to check out the new project scaffold:

```bash
.
├── Cargo.lock
├── Cargo.toml
├── README.md
├── fluence.yaml
└── src
    ├── aqua
    │   └── main.aqua
    └── frontend
        ├── index.html
        ├── package.json
        ├── src
        └── tsconfig.json
```

You can ignore other folders which ain't listed in the structure above. They're not important for this tutorial.

```sh
cd ./js-example
```

Now you can place aqua files in `src/aqua` and compile them via `fluence aqua` command

Your js files should reside in `src/frontend` dir.

Go to `src/frontend` folder and run `npm install`.

To start your frontend project in dev mode, run `npm run dev`. 

### Setting up for Node.js 

If you want to run JS client in Node.js, you need to do some editing in frontend folder:
- Remove `index.html` file from `src/frontend` folder
- Run `npm remove vite` in `src/frontend` folder.
- Remove vite specific scripts from `package.json`
- Install ts-node `npm i -D ts-node`
- Add the following script in `package.json`:
```json
"scripts": {
  "dev": "node --loader ts-node/esm index.ts"
}
```

Now you are ready to go. Use `npm run dev` to run `index.ts` file in Node.js
