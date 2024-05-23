# Connecting To The World

Let's expand on the [previous section](./your_first_function.md) by adding a small but powerful improvement to our code. Specifically, we want to be able to make HTTP requests from our Cloudless Functions. Since Wasm can't do that natively, we need to spend a little time on what we call [Managed Effects](./..glossary/#managed-effects).

While Wasm provides a lot of benefits including portability and performance, it currently has a few limitations, such as a lack of sockets. In order to enable your functions to make HTTP requests, we need to go outside the Wasm sandbox and access the host system Marine's [Mounted Binaries](./../glossary#mounted-binary), also see [Marine Book](https://fluence.dev/docs/marine-book/marine-runtime/mounted-binaries), allow us to utilize permissioned resources, such as a *curl* binary and the Wasm module(s) calling it, on the host system. The emphasis is on **permissioned** resources, which allows us to retain significant security coverage while venturing outside the secure sandbox. 

## Intro To Host Resource Permissioning And Fluence Effector Modules

In order the make managed effects work for a developer, two things are required:

* the host has available the resource you, the developer, wants to access via a Wasm module
* the host permissions your, the developer's Wasm module utilizing Marine's Mounted Binaries, to access the desired (and hosted) resource

From a high-level perspective then, a manged effect generally requires two components: a hosted resource, such as a binary, adn a Wasm module allowed to access the hosted resource via Mounted Binaries and, effectively, exposing an API to the hosted resource for use by other Wasm modules and, of course, Aqua. 

Of course, there are a few more caveats, such as maintaining version compatibility and location (directory) consistency across providers and more. We'll provide a more in-dept presentation, including how to write and provision your own effector(s), shortly. In the meantime, you can utilize two effectors maintained by Fluence and supported by all participating providers: a [curl effector](https://github.com/fluencelabs/curl-effector) and an [IPFS effector](https://github.com/fluencelabs/ipfs-effector). Also see the [example use](https://github.com/fluencelabs/effectors/tree/main/example) of both effectors.


## Working With The cURL Effector Module

Create a project with Fluence CLI. This time we choose the *minimal* template but stick with the default environment selection, *dar* and name our project *http-enabled*:

```bash
fluence init http-enabled
```

`cd` into you new directory and look around:

```bash
tree -L 2 .
.
├── README.md
├── fluence.yaml
└── src
    └── aqua
```

This clearly is a much more minimalist scaffold than what the *quickstart* template provides and the first thing we need to do is create a our Marine artifacts by creating a new service called http_requester:

```bash
fluence service new http_requester
```

We now got our project skeleton in place and are ready to create ....

Let's stick with the http request function from the [example](https://github.com/fluencelabs/effectors/blob/e8e3251a80e3a44fc1887f7e7a47aef3c0ecfdcb/example/src/services/myRPC/modules/myRPC/src/main.rs#L16) and stick it in our main.rs file. Before we do that, though, let's add the [curl effector crate](https://crates.io/crates/curl-effector-imports), based on the [curl effector repo](https://github.com/fluencelabs/curl-effector) to our project (note that version numbers may have changed):

```toml
## src/services/http_requester/http_requester/Cargo.toml
[package]
name = "http_requester"
version = "0.1.0"
edition = "2018"

[[bin]]
name = "http_requester"
path = "src/main.rs"

[dependencies]
marine-rs-sdk = "0.14.0"
curl-effector-imports = "0.1.1"   # <- our effector crate

[dev-dependencies]
marine-rs-sdk-test = "0.16.1"
```

Looking at the [source code](https://github.com/fluencelabs/curl-effector/blob/main/effector/src/main.rs#L126), you see the exposed cUrl API for [get](https://github.com/fluencelabs/curl-effector/blob/e820ea273fd30177ed7eef76358ad26089a35129/effector/src/main.rs#L104) and [post](https://github.com/fluencelabs/curl-effector/blob/e820ea273fd30177ed7eef76358ad26089a35129/effector/src/main.rs#L67) requests, respectively, as well as some support and test functions. So when all is said and done, the crate effectively gives you two API functions to use in your Wasm modules to make http calls.

```rust
//get
pub fn curl_get(request: CurlRequest, output_vault_path: &str) -> CurlResult { ... }

// post
pub fn curl_post(request: CurlRequest, data_vault_path: &str, output_vault_path: &str) -> CurlResult {...}
```

Of course, there's a bit more to it. Looking in the [import.rs](https://github.com/fluencelabs/curl-effector/blob/main/effector/src/import.rs) file, you'll see where the "connection" between the Wasm module and the hosted binary is facilitated:

```rust
use marine_rs_sdk::{marine, MountedBinaryResult};

#[marine]
#[host_import]
extern "C" {
    /// Execute provided cmd as a parameters of curl, return result.
    pub fn curl(cmd: Vec<String>) -> MountedBinaryResult;
}
```

In essence, we use Rust's foreign function interface (FFI) to access the host's curl binary with MountedBinary returning a [MountedBinaryResult](https://github.com/fluencelabs/marine-rs-sdk/blob/d94bf3aa641dc294286bd326e3e9244da5bda7ef/src/mounted_binary.rs#L28), which basically captures any hosted binary's response in terms of stdout and stderr byte arrays.

## Using The cUrl Effector

So now we got our cUrl Wasm API and know how the access to and response from the host resource, i.e., curl binary, is handled. And when you [compile](https://github.com/fluencelabs/curl-effector/blob/main/build.sh) the code, you'll end up with a Wasm module ... but you don't compile the code for the Wasm module just yet! Instead, import a [pre-built curl effector module](https://github.com/fluencelabs/curl-effector/releases/tag/effector-v0.1.1). Why? Remember the permissioning reference from a few paragraphs earlier? Well, in order for a host to confidently permission a Wasm module's access to a hosted binary, they want to review the code to make sure nothing nefarious is going on. Of course, that's not a feasible, scalable modus operandi. Instead, hosts use a package's immutable [contend identifier](https://docs.ipfs.tech/concepts/content-addressing/) (CID) to non-interactively identify pre-approved packages. Alas, compilers are not quite deterministic in their creation of output and different versions tend to produce slightly different output all leading to different CIDs for the same functionality. Since a one-to-many CID solution is also untenable, Fluence is providing the above referenced compiled and CID'ed module for you to use and for hosts to unequivocally recognize and permission. Try to compile your own module, maybe change a comment for good measure and to make sure you get a different CID, and then try to deploy it to a host.

To import a module into a service, you can use the Fluence CLI:

```bash
fluence module add https://github.com/fluencelabs/curl-effector/releases/download/effector-v0.1.1/curl_effector.tar.gz --service http_requester
```

Let's put the curl-effector to work and write some facade code:
 
```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

use curl_effector_imports as curl;
use curl_effector_imports::CurlRequest;

module_manifest!();

pub fn main() {}

fn vault_path(filename: &str) -> String {
    let cp = marine_rs_sdk::get_call_parameters();
    format!("/tmp/vault/{}-{}/{}", cp.particle.id, cp.particle.token, filename)
}

#[marine]
pub fn demo_request(url: String) -> String {
    let path = vault_path("curl_effector_dir");
    let my_request = CurlRequest {
        url,
        headers: vec![],
    };
    let result = curl::curl_get(my_request, path.clone());
    if result.success {
        match std::fs::read_to_string(&path) {
            Ok(result) => result,
            Err(err) => err.to_string()
        }
    } else {
        result.error
    }
}
```

While the `demo_request` function is straight-forward, the `vault_path` function may need some explaining. To get some insight, see [here](https://github.com/fluencelabs/effectors/blob/e8e3251a80e3a44fc1887f7e7a47aef3c0ecfdcb/example/src/services/myRPC/modules/myRPC/src/main.rs#L48) and [vault](https://fluence.dev/docs/build/glossary#particle-file-vault) for more info. But basically, the effector module needs to know where it should look for the pertinent IO data related to the underlying [particle](https://fluence.dev/docs/build/glossary#particle). This function uses the existing vault path and appends an effector specific dir.

Compile the code and let's have a look at it in the Marine REPL with `fluence service repl http_requester`. Bur before you do, make sure you have the following directory in `.fluence/tmp/volumes/id-token`; if it's not there, create it. Back to the repl:

```bash
$ fluence service repl http_handler
<...>

Welcome to the Marine REPL (version 0.30.1)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 91169eba-442e-463e-a3d7-0ca6ab967763
elapsed time 62.390167ms

1> call http_handler demo_request ["https://www.example.com"] {"particle": {"id":"id", "token":"token"}}
result: "<!doctype html>\n<html>\n<head>\n    <title>Example Domain</title>\n\n    <meta charset=\"utf-8\" />\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 2em;\n        background-color: #fdfdff;\n        border-radius: 0.5em;\n        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        div {\n            margin: 0 auto;\n            width: auto;\n        }\n    }\n    </style>    \n</head>\n\n<body>\n<div>\n    <h1>Example Domain</h1>\n    <p>This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.</p>\n    <p><a href=\"https://www.iana.org/domains/example\">More information...</a></p>\n</div>\n</body>\n</html>\n"
 elapsed time: 578.853375ms
```

All looks good and we're ready to deploy our code. Note that we had to add the `{"particle": {"id":"id", "token":"token"}}` configuration map to our call to handle the vault references expected by the module as there is no particle available in REPL mode.

As a last step, deploy your service to either `dar` or `local` and let's update our `aqua.main` so we can run the deployed code:

```python
-- aqua.main
<...>
export demo_http

data HTTPResponse:
    http_response: ?string
    worker: Worker

func demo_http(url: string) -> []HTTPResponse:
    deals <- Deals.get()
    dealId = deals.myDeployment!.dealIdOriginal
    responses: *HTTPResponse
    
    on HOST_PEER_ID:
        subnet <- Subnet.resolve(dealId)
    if subnet.success == false:
        Console.print(["Failed to resolve subnet: ", subnet.error])

    for w <- subnet.workers:
        if w.worker_id == nil:
            responses <<- HTTPResponse(http_response=nil, worker=w)
        else:
            on w.worker_id! via w.host_id:
                http_response <- HttpHandler.demo_request(url)
                responses <<- HTTPResponse(http_response=?[http_response], worker=w)

    <- responses
```

Run our function with `fluence run -f 'demo_http("https://example.com")'` to call an http request to a url of your choosing:

```bash
$ fluence run -f 'demo_http("https://example.com")'

Using aqua compiler version: 0.14.5
Using local blockchain environment
Connecting to random local relay: /ip4/127.0.0.1/tcp/9991/ws/p2p/12D3KooWBXmrDsroJP1mkPx3usds81WB1LoZH4RTtYnKKvhZof4Q
Connected
Running demo_http("https://example.com") from /Users/bebo/localdev/new-effector/src/aqua/main.aqua

[
  {
    "http_response": "<!doctype html>\n<html>\n<head>\n    <title>Example Domain</title>\n\n    <meta charset=\"utf-8\" />\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 2em;\n        background-color: #fdfdff;\n        border-radius: 0.5em;\n        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        div {\n            margin: 0 auto;\n            width: auto;\n        }\n    }\n    </style>    \n</head>\n\n<body>\n<div>\n    <h1>Example Domain</h1>\n    <p>This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.</p>\n    <p><a href=\"https://www.iana.org/domains/example\">More information...</a></p>\n</div>\n</body>\n</html>\n",
    "worker": {
      "host_id": "12D3KooWBXmrDsroJP1mkPx3usds81WB1LoZH4RTtYnKKvhZof4Q",
      "pat_id": "0x0f6dc2416cc2fcfd22588909ead5f55395de8039cb40d309c50c1451c531d164",
      "worker_id": "12D3KooWPnK9fB8VBqsawA3amxwPsuyh4JVDivLDeirwDDMR2iEX"
    }
  },
  <...>
]
```

And that's a wrap. You now know how to utilize managed effects and use Fluence's curl and ipfs effectors to enable your applications to interact with the world!
