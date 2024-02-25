# Connecting To The World

Let's expand on the [previous section](./your_first_function.md) by adding a small but powerful improvement to our code. Specifically, we want to be able to make HTTP requests from our Cloudless Functions, which requires us to spend a little time on Marine and Wasm before we can start coding.

While Wasm provides a lot of benefits including portability and performance, it currently has a few limitations, such as a lack of sockets. In order to enable your functions to make a HTTP request, we need to take advantage of Marine's [Mounted Binaries](../glossary/#mounted-binary), also [Marine Book](https://fluence.dev/docs/marine-book/marine-runtime/mounted-binaries), which allow us to utilize permissioned binaries, such as *curl*, on the host system.

The emphasis is on **permissioned binaries** and before we can move forward, we need to take a step back and discuss security and resource availability. 

## Intro To Host Resource Permissioning And Fluence Effector Modules

Fluence's open, permisisonless peer-to-peer network is the result of a number of largely independently operated, Fluence Protocol compliant peers hosted on heterogenous (data center) servers. Each of these (protocol-compliant) peers is capably to hose and execute compute functions based on [pure](../glossary/#pure-module) modules due to the Wasm's inherent portability (across peers) and runtime insulation of the host system. That is, Wasm modules execute in a tight sandbox clearly separating the host system form the Wasm module providing a high level of security to the host. However, many Cloudless Apps need more capabilities than the sandboxed Wasm modules provide, e.g., executing HTTP requests which depends on host resources being made available to the module(s). In the absence of Wasm sockets, host access from the module is required. Alas, accessing host resources from Wasm modules requires us to loosen the sandbox, which is what Mounted Binaries do, at the cost of weakening security. Hence, providers may reject hosting marine services utilizing Mounted Binaries.

Even if a provider is willing to accept some Wasm module wanting to utilize host resources, there is the issue of "general availability": In order for a peer to be able to host a Wasm module with the desired access to a host resource, e.g., a cURL binary, the provider not only needs to have that resource available in a manner consistent with other peers (outside of their control), e.g., appropriate version of the resource, but also offer such a resource in a consistent manner, e..g, adhere to a single path to, say, the curl binary such as `/usr/bin/curl`. 

In Fluence terminology, [effector modules](../glossary/#effector-module) accesses resources, such as APIs, outside of Marine. For example, a Wasm module making HTTP calls using the host system's `curl` binary is an effector module that needs to be permissioned by the host while adhering to some basic rules observed by all participating peers.

If your function needs to work with some external effects, you need to implement that logic in an effector module that is uniquely identifiable, permissionable and provisioned by participating providers. Not all providers may host a particular effector module. But that providers that do need to serve such an effector module in a consistent manner across heterogenous hosts. 

In order to create a uniquely identifiable effector module, we can use a [CID](https://ipld.io/glossary/#cid) to uniquely identify such a module. Alas, different compiler settings lead to slightly different Wasm compile output and therefore different CIDs. Hence, Fluence is providing a [repo](https://github.com/fluencelabs/fluence-effectors) of permissionable effector modules with their associated CIDs that currently includes a curl and ipfs effector module, respectively.

To be able to use en effector module just as the *curl_adapter* you need to use the version provided by the repo as well as the associated CID (version 1). Neither the `dar` testnet nor the `kras` mainnet peers will accept effector modules that do not hash to the respective CIDs in the repo.

Stay tuned for a more detailed chapter!


:::info
If you need an effector capability currently not offered, contact us in [discord](https://fluence.chat). For development purposes, however, you can use *local network*. 
:::


## Using The Permissionable cURL Effector

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




## Creating An Effector Module

:::info
If you are interested in using the curl-adapter module, you can skip to the next section. In this section we go through that steps necessary to create a curl-adapter module using Mounted Binaries. Note that that process involves switching to the [local network](../setting-up/working_with_local_networks.md) as the local configuration does not require CIDs in order to be able to deploy a module utilizing Mounted Binaries.
:::

Let's create a Wasm module giving us access to the hosts *curl* binary and link that Wasm module to one or more other modules so you end up with Fluence Functions capable of making HTTP requests. But first, we create a new (Fluence Functions) project using the Fluence CLI. This time we choose the *minimal* template but stick with the default environment selection, *kras* and name our project *http-enabled*:

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

This clearly is a much more minimalist scaffold than what the *quickstart* template provided. Fhe first thing we need to do is create our Marine artifacts by creating a new service, let's call it http_requester:

```bash
fluence service new http_requester
```

which prompts you to specify the deployment. Approve the default and you'll see:

```bash
Added http_requester to myDeployment
```

Check that  the *http_requester* service was added to your project:

```bash
$ tree -L 6 ./src
./src
├── aqua
│   └── main.aqua
└── services                            // result of new service creation
    └── http_requester                    
        ├── modules
        │   └── http_requester          // our facade module 
        │       ├── Cargo.toml
        │       ├── module.yaml         // module specific configuration details
        │       └── src
        │           └── main.rs
        └── service.yaml                // service level configuration and linking details
```

The new service has been added to the project and is reflected in *fluence.yaml*. Moreover, a *main.rs* file was created by the CLI and upo inspection, you'll notice it's the same content as the file created for the quickstart. Not to worry, we'll clean that up as soon as we've added our curl adapter to enable http requests. 

To this end, we'll add a second module to our project:

```bash
$ fluence module new curl_adapter --path src/services/http_requester/modules/
```

And upon inspection, you should see something like so:

```bash
$ tree -L 6 ./src
./src
├── aqua
│   └── main.aqua
└── services
    └── http_requester
        ├── modules
        │   ├── curl_adapter            // the newly created module template
        │   │   ├── Cargo.toml
        │   │   ├── module.yaml
        │   │   └── src
        │   │       └── main.rs
        │   └── http_requester
        │       ├── Cargo.toml
        │       ├── module.yaml
        │       └── src
        │           └── main.rs
        └── service.yaml
```

All looks well and we have the desired service-modules structure in place and it's time to add the *curl_adapter.wasm* from the [Fluence effector](https://github.com/fluencelabs/fluence-effectors/tree/main/curl_adapter). Add the wasm 

```rust
#![allow(improper_ctypes)]

use marine_rs_sdk::{marine, MountedBinaryResult};

pub fn main() {}

#[marine]                                                         // wrap the linked curl command as a callable function
pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult {
    curl(cmd)
}

#[marine]                                                          // here we provide the FFI to the host's curl binary
#[link(wasm_import_module = "host")]
extern "C" {
    fn curl(cmd: Vec<String>) -> MountedBinaryResult;
}
```

That's right, just a few lines are required to bring HTTP requests to Wasm thanks to the heavy lifting done by Marine. The key to this module is the import of the [MountedBinaryResult](https://fluence.dev/docs/old-build/aquamarine/marine/marine-rs-sdk#mountedbinaryresult) at very top and the `extern` keyword at the bottom of the file. As mentioned earlier, *MountedBinary* allows the module to interact with the host's *curl* binary, whereas the [extern}(https://doc.rust-lang.org/std/keyword.extern.html) key word provides for a FFI block declaration for foreign code wrapped in the *marine* macro making it callable and linkable to other modules.

Go ahead and delete the content in the `<...>/modules/curl_adapter/src/main.rs`and replace it with above code. Moreover, open the *module.yaml* file and update it to:

```yaml
version: 0

type: rust

name: curl_adapter
mountedBinaries:            // add this and the line below, which tells the Marine runtime where to look for the binary
  curl: /usr/bin/curl
```

We appended the location of the binary we want to call, in this case our curl binary, from the Wasm module as a MountedBinary. Make sure the path provided is correct, e.g. use `which curl` in your terminal and copy the resulting path if different than the one provided in the example code. Note that since we are using the REPL, all paths are to the local system. Make sure to make any necessary adjustments when deploying to remote.

Now we just need update the service.yaml file so the service knows that the curl_adapter module exists:

```yaml
modules:
  facade:
    get: modules/hello_from
  curl-adapter:                 # add this and the next line
    get: modules/curl_adapter
```

Without worrying about our facade module, i.e., the module we want to use the curl-adapter from, go ahead and build the project with `fluence build` and fire up the REPL with `fluence service repl http_requester` and use the `i` or `interface` command to display the public interfaces of all loaded modules:

```bash
# Making sure service and modules are downloaded and built...
Welcome to the Marine REPL (version 0.24.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = b315ba31-4147-4af1-aaa8-bce5ad9b0917
elapsed time 43.863125ms

1> i
Loaded modules interface:
exported data types (combined from all modules):
data MountedBinaryResult:
  ret_code: i32
  error: string
  stdout: []u8
  stderr: []u8

exported functions:
curl_adapter:
  func curl_request(cmd: []string) -> MountedBinaryResult
http_requester:
  func greeting(name: string) -> string

2>
```

We see interfaces for two loaded modules: our curl-adapter and our unchanged templated facade module with the default *greeting* function. Go ahead, call the greeting function and make sure things work with `call http_requester greeting ["Fluence"]`. Of course, we can do the same with the curl interface: 

```bash
call curl_adapter curl_request [["https://www.example.com"]]
```

That is, we call the *curl_request* function in the *curl-adapter* (module) namespace and provide an url as a parameter. If you go back to the curl-adapter code, we see that we specified that the curl binary is to be called with an array of string params. Moreover, recall that our return type was *MountedBinaryResult*, a *marine macro* wrapped Rust struct. Conveniently, REPL exported the struct as well as a data interface with its items and types. In order to get a little more information on the struct's parameter values, we can look at the [source code](https://github.com/fluencelabs/marine-rs-sdk/blob/e112719b240c8cf526783bde213289f1b64e1a10/src/mounted_binary.rs#L29), and we can see that a successful curl call results in a *ret_code* value of 0, if there is an error, it'll be captured in the *error* field and the actual http responses are capture in the stdout and stderr fields as byte arrays.

```bash
2> call curl_adapter curl_request [["https://www.example.com"]]
result: {
  "error": "",
  "ret_code": 0,
  "stderr": [
    32,
    <...>
    10
  ],
  "stdout": [
    60,
   <...>
    10
  ]
}
 elapsed time: 293.370709ms

3>
```

Looks like our HTTP request succeeded and we got a bunch of bytes back, which is nice but not particularly informative. Instead of *MountedBinaryResult* we can use [MountedBinaryStringResult](https://github.com/fluencelabs/marine-rs-sdk/blob/e112719b240c8cf526783bde213289f1b64e1a10/src/mounted_binary.rs#L45C12-L45C37). Go ahead and swap the two result typed in your code including at the import section, re-build the project and startup the REPL, where you should see something similar to this:

```bash
1> call curl_adapter curl_request [["https://www.example.com"]]
result: {
  "error": "",
  "ret_code": 0,
  "stderr": "  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0\r100  1256  100  1256    0     0    685      0  0:00:01  0:00:01 --:--:--   688\n",
  "stdout": "<!doctype html>\n<html>\n<head>\n    <title>Example Domain</title>\n\n    <meta charset=\"utf-8\" />\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 2em;\n        background-color: #fdfdff;\n        border-radius: 0.5em;\n        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        div {\n            margin: 0 auto;\n            width: auto;\n        }\n    }\n    </style>    \n</head>\n\n<body>\n<div>\n    <h1>Example Domain</h1>\n    <p>This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.</p>\n    <p><a href=\"https://www.iana.org/domains/example\">More information...</a></p>\n</div>\n</body>\n</html>\n"
}
 elapsed time: 1.868767541s

2>
```

Again, our HTTP request successfully executed but now we can read our *stderr* and *stdout* pipes a little better. Loos like the curl binary writes the request metadata into *stderr* and we get the html code of the *example.com* site in *stdout*. Of course, go ahead, double check the output in your browser.

Before we get to implement our actual business logic utilizing the curl-adapter module, lets quickly recap what happened so far: We created a reusable(!) Wasm module that allows us to bind to a host's curl binary and learned that Marine enables the necessary FFI approach to bind to essentially any binary available and permissioned by a host including the curl binary. That by the way is actually a powerful construct adding much value to the Wasm runtime and, of course, your Fluence Functions. Finally, we tested our curl binding to the local host and experimented with both byte- and string-based return types.

Let's kick it up a notch and turn our sleepy greeting function into something a little more interesting and useful. How about we create a Fluence Functions that takes a timezone instead of just a name and returns the local date and time? To make things a little easier on us, we'll use the [WorldTimeAPI](https://worldtimeapi.org/) to do the heavy lifting and provide us with the desired information for a given timezone parameter.

Change into the `src/services/http_requester/modules/http_requester` to add a couple Rust crates we want to use in our new endeavor with `cargo add chrono serde_json` and proceed to our code, which goes into the replaces the template code in `<..>/modules/http_requester/src/main.rs`:

```rust
#![allow(non_snake_case)]
use marine_rs_sdk::{marine, MountedBinaryStringResult};
use serde_json;

// url for the Worldtime API
const API_URL: &str = "https://worldtimeapi.org/api/timezone";


pub fn main() {}

// custom struct to return our query results in form of stderr, stdout
// making it easier to subsequently handle the output
#[marine]
pub struct SimpleResult {
    pub stderr: String,
    pub stdout: String,
}

impl SimpleResult {
    fn new( stderr: String, stdout: String) -> Self {
        SimpleResult {
            stderr,
            stdout,
        }
    } 
}

// mostly for demo purposes, note how this fucntion is not wrapped in marine
// and therefore not available to be called. check the REPL output.
fn get_timezone(timezone: &String) -> SimpleResult {

    let url = format!("{}/{}", API_URL, timezone);
    let res = curl_request(vec![url]);
    if res.ret_code==0i32{
        return SimpleResult::new("".to_owned(), res.stdout);
    }
    SimpleResult::new(res.error, "".to_owned())
}

// this is our main function we expect to call for our timezone result
#[marine]
pub fn what_o_clock(timezone: String) -> SimpleResult {
    if ! timezone.contains("/") {
        return SimpleResult::new("invalid timezone format".to_owned(), "".to_owned());
    }

    let api_response = get_timezone(&timezone);
    if api_response.stderr.len() > 0 {
        return api_response;
    }

    let j_response: Result<serde_json::Value, serde_json::Error> = serde_json::from_str(&api_response.stdout);
    match j_response {
        Ok(dt) => {
            let datetime = chrono::DateTime::parse_from_rfc3339(dt["datetime"].as_str().unwrap()).unwrap();
            let city = timezone.split("/").collect::<Vec<&str>>()[1];
            let city_time = format!("The local time in {} is {}", city, datetime.time());
            SimpleResult {stderr: "".to_owned(), stdout: city_time}
        },
        Err(e) => SimpleResult {stderr: format!("timezone conversion error: {}", e), stdout:"".to_owned()},

    }
}

// here we provide the linking info for the curl-adapter module and expose the
// curl_request method to the facade module
#[marine]
 #[link(wasm_import_module = "curl_adapter")]
 extern "C" {
     pub fn curl_request(cmd: Vec<String>) -> MountedBinaryStringResult;
 }
```

For the most part, the code is straight forward Rust code. However, note that we created a *struct* for our result. This is due to the [type limitations](https://fluence.dev/docs/marine-book/marine-runtime/i-value-and-i-type) inherent in WASM. Feel free to experiment with the return type. In addition, we linked and marine-wrapped the *curl-adapter* module with the last four lines of the code, which once again uses *extern* to facilitate the link and expose the *curl_request* function to the facade module. Note that we specify the *MountedBinaryStringResult* return type we ended up using in the *curl-adapter* module.

Back in your project root directory, `fluence build` the project and start the REPL with `fluence service repl http_requester` and use the *Europe/Amsterdam* timezone:

```bash
Welcome to the Marine REPL (version 0.24.0)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 807fd75e-2cdd-4e1a-9758-daaa730fc9d4
elapsed time 58.258625ms

1> call http_requester what_o_clock ["Europe/Amsterdam"]
result: {
  "stderr": "",
  "stdout": "The local time in Amsterdam is 13:15:30.821531"
}
 elapsed time: 699.5155ms

```

Alright, we got what we wanted but maybe not quite in the format we wanted. Go ahead and clean things things up to your hearts content. Make sure you re-build the project after every change so you are loading the most recent Wasm modules into the REPL.


**Payment, deploy once we have it.**
