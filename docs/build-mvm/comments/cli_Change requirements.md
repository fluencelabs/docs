Change requirements:

* Need to figure out our payment model with Fist onramp providers and the CLI

* CLI changes above and beyond Fiat onramp requirement

    * developers shouldn't be prompted to choose from network options at startup. There is only one network, kras or whatever the capacity provider support network is called
    ```bash
    ? Select Fluence Environment to use by default with this project (Use arrow keys)
    ❯ kras (default)
     testnet
     stage
     local
     custom
    ```
    * the incuded hello work example is wanting:
    ```
     fluence run -f 'runDeployedServices("Fluence")'
Connecting to random kras relay: /dns4/8-kras.fluence.dev/tcp/9000/wss/p2p/12D3KooWEFFCZnar1cUJQ3rMWjvPQg6yMV2aXWs2DkJNSRbduBWn
Connected
[
  {
    "answer": "Hi, Fluence",
    "worker": {
      "host_id": "12D3KooWD7CvsYcpF9HE9CCV9aY3SJ317tkXVykjtZnht2EbzDPm",
      "pat_id": "0x8e0e15d36d05c6e2d1e4e8925c41def241e79500200007d48fa8ecdb0c3fc8fe",
      "worker_id": "12D3KooWBTGMS1g5HCLQMk57D7s7QbsnkxRRunKWADfiMiX5YsqU"
    }
  },
  {
    "answer": "Hi, Fluence",
    "worker": {
      "host_id": "12D3KooWKnEqMfYo9zvfHmqTLpLdiHXPe4SVqUWcWHDJdFGrSmcA",
      "pat_id": "0x16a2da97385a742b7ace03333506829926d3fbc8277f6e54575749a461fd6597",
      "worker_id": "12D3KooWFqWLV2aMsxQurUBhk8MX9QGxbPvD4mhWmHx8k9ccreJn"
    }
  },
  {
    "answer": "Hi, Fluence",
    "worker": {
      "host_id": "12D3KooWHLxVhUQyAuZe6AHMB29P7wkvTNMn7eDMcsqimJYLKREf",
      "pat_id": "0x6060ed6f11e79468ac978946c2d9c0530835bbc28ea327c26143464cf574cf68",
      "worker_id": "12D3KooWBioMtUQ8BJE1osWa9ap5P8Wpd4CgNcF2Qn729yE81SNB"
    }
  }
]
 ```

* Any chance we can cleanup Aqua to improve the developer experience?
    * ship with the hello-world Wasm service ( or better a deployed service set) as part of a getting-started template or the existing quickstart template
    * should replace service with Lambda?
    * it's still deal deploy
    * common for deployment (today):
    ```python

    ```

* Local Network Install
    * should just be the dockerized peers without payment, Fiat gateway or otherwise. both Joera and Margan complained about the current setup

