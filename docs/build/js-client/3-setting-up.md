# Setting up project

## Install dependencies

Initialize an empty `npm` package:

```sh
npm init
```

In newly created `package.json` file add module entry
```json
{
  "type": "module",
  ...
}
```

We will need JS-client itself

```sh
npm install @fluencelabs/js-client@unstable
```

We will need the Fluence CLI to use the Aqua compiler, but only as a development dependency:

```sh
npm install --save-dev @fluencelabs/cli
```

Aqua comes with the standard library, which can be accessed from "@fluencelabs/aqua-lib" package. This package in bundled in Fluence CLI, so you don't need to install anything.

And last, but not least, we need TypeScript:

```sh
npm install --save-dev typescript ts-node
```

Create `tsconfig.json` file and add following content there

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "nodenext"
  }
}
```

## Compiling aqua

Create directory `aqua` for storing your aqua files there. You probably want to keep the generated TypeScript in the same directory with other typescript files, usually `src`. Let's create the `src/_aqua` directory for that.

Imagine we have `hello-world.aqua` file which we want to compile. The example project structure would look like this:

```
 ┣ aqua
 ┃ ┗ hello-world.aqua
 ┣ src
 ┃ ┣ _aqua
 ┃ ┃ ┗ hello-world.ts
 ┃ ┗ index.ts
 ┣ package-lock.json
 ┣ package.json
 ┗ tsconfig.json
```

To compile Aqua, we can use the Fluence CLI with `npm`:

```sh
npx fluence aqua -i ./aqua/ -o ./src/_aqua
```

To watch for Aqua file changes, add the `-w` flag:

```sh
npx fluence aqua -w -i ./aqua/ -o ./src/_aqua
```

We recommend to store this logic inside a script in the `packages.json` file:

```json
{
  "scripts": {
    "compile-aqua": "fluence aqua -i ./aqua/ -o ./src/_aqua",
    "watch-aqua": "fluence aqua -w -i ./aqua/ -o ./src/_aqua"
  }
}
```

Using the code generated by the compiler is as easy as calling a function. The compiler generates all the boilerplate needed to send a particle into the network and wraps it into a single call. It also generates a function for service callback registration. Note that all the type information and therefore type checking and code completion facilities are there!