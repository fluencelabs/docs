# Develop distributed algos

- ...

Learning

Let's turn the *hello_world* implementation to something more informative: we want a function that takes a city name and returns a greeting with the local time, e.g., "Hello, New York. It is 23:01:14."

In order to get the time, we write an adapter using the hosting peer's curl binary to make a call to [WorldTimeAPI](https://worldtimeapi.org/). For our purposes, we shift some work on the user and limit our wordly greeting to the following [cities](https://worldtimeapi.org/timezones).

Let's create a new Fluence project with Fluence CLI:

```
$ fluence init hello-world-with-time
? Select template minimal

Successfully initialized Fluence project template at ~/localdev/documentation-examples/hello-world-with-time

$ cd hello-world-with-time

```

And let's create a new service:

```
$ fluence service new
? Enter service path services
? Do you want to use services as the name of your new service? No
? Enter service name (must start with a lowercase letter and contain only letters, numbers, and underscores) hello_world
Successfully generated template for new service at services
? Do you want add hello_world to fluence.yaml? Yes
    Updating crates.io index
   <...>
   Compiling hello_world v0.1.0 (/Users/bebo/localdev/documentation-examples/hello-world-with-time/services/modules/hello_world)
    Finished release [optimized] target(s) in 20.15s
Added hello_world to fluence.yaml
```

In the newly created `services` directory, you find the services.yaml configuration file:

```
$ cat services/services.yaml
version: 0
name: hello_world
modules:
  facade:
    get: modules/hello_world

```

which drives the configuration of the modules comprising the service; in this case, it's just the `hello_world` module, which itself is defined in the `services/modules/hello_world/module.yaml`:

```
$ cat services/modules/hello_world/module.yaml

version: 0
type: rust
name: hello_world

```

Note that the hello_world module is the [facade module](/docs/marine-book/marine-runtime/module-types/), i.e., the module that provides the public access API to all modules comprising the service. Let's add another module to clarify the distinction.

In order to be able to interact with the WorldTimeApi from our Wasm module and Aqua, we need to provide some socket capability for the HTTP call. Since Wasm modules are single threaded without a socket, we need to literally look outside the (Wasm) sandbox. In fact, we are going to write and *adapter* to the service host peer's curl binary! Of course, the host needs to agree to provide the curl resource at the time of accepting to host your service.

Let's write our curl adapter, which is in Fluence parlance called an [effector module](/docs/marine-book/marine-runtime/module-types/). Why? Because they can access resources outside the Wasi sandbox, such as host filesystems and binaries.

To access a host's binaries, we need to make use of Rust's [FFI](https://doc.rust-lang.org/nomicon/ffi.html) and Marine supports tis with the [MountedBinary type](/docs/marine-book/marine-runtime/mounted-binaries).

In essence, we need to link to the curl binary available on the host system and expose its cli interface to the Wasm module:

```
#[marine]
#[link(wasm_import_module = "host")]
extern "C" {
    fn curl(cmd: Vec<String>) -> MountedBinaryResult;
}
```

which basically says: the host's curl binary is linked and exposed as an import to the Wasm module and can be called with the `curl` function call, which takes an array of strings as its only argument and returns the [MountedBinaryResult](/docs/marine-book/marine-runtime/mounted-binaries):

```
struct MountedBinaryResult:
  ret_code: i32
  error: String
  stdout: Vec<u8>
  stderr: Vec<u8>
```

In essence, this struct encapsulates a return code, an error string and the stdout and stderr sinks you expect from calling a binary. We revisit the use of *MountedBinaryResult* once we start running our code.

Now we need some finishing touches to the adapter code and configuration file. Let's start by adding a new module to the already existing hello_world service:

```
$ fluence module new
? Enter module path services/modules/curl_adapter
Successfully generated template for new module at services/modules/curl_adapter
```

In our new curl_adapter module template, replace the example code with the following:

```
use marine_rs_sdk::{marine, MountedBinaryResult};

pub fn main() {}

#[marine]
pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult {
    curl(cmd)
}

#[marine]
#[link(wasm_import_module = "host")]
extern "C" {
    fn curl(cmd: Vec<String>) -> MountedBinaryResult;
}
```

In addition to our FFI code, we write a wrapper, *curl_request* or whatever name you want to give it, which is the only public method of this module. Recall that the curl function in the FFI section exposes the link to the binary to the module but not beyond. We need to do one more thing to make this module usable and that is to update its configuration file at `services/modules/curl_adapter/module.yaml`, which currently reads:

```
version: 0
type: rust
name: curl_adapter

```

In order for the Marine runtime and, by extension the host peer, to know what external resources are necessary to run the curl_adapter module, we need to provide additional configuration information. Update your file to:

```
version: 0
type: rust
name: curl_adapter
mountedBinaries:
  curl: /usr/bin/curl

```

Which provides the actual location of the curl command on the host system to MountedBinary. For more detailed information see the corresponding [Marine book](/docs/build/concepts/#modules) and [Fluence CLI](https://github.com/fluencelabs/fluence-cli/blob/main/docs/configs/module.md) sections.

Now we have a functioning curl adapter (effector) module ready to be used by *any* other Wasm module in need of HTTP calling capabilities!

Back to the contrived problem at hand: given a city, return a greeting with the local time. Before we dive into the business logic code, let's have a look at how we get our *curl_request* function working in this (facade) module:

```
#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
   pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult;
}

```

This may look rather familiar but the keen observer notices critical differences to the linking code in our *curl_adapter*: our import module is not "host" but the actual *curl_adapter* module, as define in the `services.yaml` configuration file. Moreover, we import the exposed *curl_request* function to our (import) module, which is what we'll use to interact with the host's curl binary.

Just to recap: In the *curl_adapter* module, we used Rust's FFI to link to some yet-to-be determined host's curl binary with the *curl* function. We mapped the *curl* function (alias) in the corresponding module.yaml config file to the actual location of the binary, `/usr/bin/curl`, and wrapped the *curl* function with the *curl_request* function, which is the publicly exposed function for the *curl_adapter* module. We then linked the imported *curl_adapter* module and exposed *curl_request* function to our facade module and now can use *curl_request* to make our HTTP calls.

Finally, it's time to implement our business logic. For the purpose of this discussion, we keep things simple but you are encourage to experiment. Now, the WorldTimeAPI spec for our curl call is: `http://worldtimeapi.org/api/timezone/:area/:location[/:region]` and we can get the `/:area/:location[/:region]` data from the [timezones listing](https://worldtimeapi.org/timezones). So if we wanted to have something like *"Hello, Amsterdam! It's 21:01:15."*, for example, we could pass `Europe/Amsterdam` as a function argument to our yet to be coded function and get back the desired string. Of course, the WorldTimeAPI returns a json document which we need to handle and convert.

Just using curl from your command line, we can preview our response:

```
curl -H "Accept: application/json"  "http://worldtimeapi.org/api/timezone/Europe/Amsterdam"

```

Returns this json document:

```
{"abbreviation":"CET","client_ip":"5.182.32.44","datetime":"2023-02-19T21:14:27.666498+01:00","day_of_week":0,"day_of_year":50,"dst":false,"dst_from":null,"dst_offset":0,"dst_until":null,"raw_offset":3600,"timezone":"Europe/Amsterdam","unixtime":1676837667,"utc_datetime":"2023-02-19T20:14:27.666498+00:00","utc_offset":"+01:00","week_number":7}

```

And the *datetime* key looks just what we want!

Go to your `services/modules/hello_world/src/main.rs` file and replace the template code with the following code, and make sure you add the `chrono` and `serde_json` dependencies to the *Cargo.toml* file in the module directory.

```
use chrono;
use marine_rs_sdk::{marine, MountedBinaryResult};
use serde_json;

pub fn main() {}

const WTAPI: &str = "http://worldtimeapi.org/api/timezone/";

fn get_timezone(name: String) -> MountedBinaryResult {
    let url = format!("{}{}", WTAPI, name);
    let curl_cmd = vec![
        "-H".to_string(),
        "Accept: application/json".to_string(),
        "-H".to_string(),
        "Content-Type: application/json".to_string(),
        url,
    ];
    let curl_response = curl_request(curl_cmd);
    curl_response
}

#[marine]
pub fn hello_world(name: String) -> String {
    let response = get_timezone(name.clone());

    let response = String::from_utf8(response.stdout).unwrap();
    if response.contains("error") {
        return response;
    }
    let response: Result<serde_json::Value, serde_json::Error> = serde_json::from_str(&response);
    match response {
        Ok(r) => {
            let rfc_dt = r["datetime"].as_str().unwrap();
            let datetime = chrono::DateTime::parse_from_rfc3339(rfc_dt).unwrap();
            let city: Vec<&str> = name.split("/").collect();
            format!("Hello, {} it's {}", city[1], datetime.time().to_string())
        }
        Err(e) => format!("error: {}", e),
    }
}

#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
    pub fn curl_request(cmd: Vec<String>) -> MountedBinaryResult;
}

```

To use the module in the project, we should add it to the `service.yaml`:

```
$ fluence module add services/modules/curl_adapter
? Enter service name from fluence.yaml or path to the service directory hello_world
```

We split our business logic into two functions: the *get_timezone* function, which calls the WTAPI with the "region/city" using our curl adapter and just passes on the results struct and the *hello_world* function, which basically turns the ATAPI response in to a string. Let's test the code with the Marine REPL:

```
$ fluence service repl services
```

compiles our code and loads our modules and linking configuration right into the REPL:

```
Blocking waiting for file lock on package cache
    <...>
    Welcome to the Marine REPL (version 0.19.1)
Minimal supported versions
  sdk: 0.6.0
  interface-types: 0.20.0

app service was created with service id = 13397857-df8e-4cf9-8eb7-ea8bac730955
elapsed time 104.658786ms

1>

```

And now we can interact with our Wasm modules. The *i*(nterface) command lists all publicly exposed structs and functions:

```
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
hello_world:
  func hello_world(name: string) -> string

```

As you can see, have access to our curl_adapter via the *curl_request* function (and not the *curl* function!), the hello_world function we just coded and the MountedBinaryResult struct.

We're now ready to interact with our modules! Let's stick with the "Europe/Amsterdam" parameter we discussed earlier". We use the *call* command followed by the (module) namespace, function name and parameter(s):

```
2> call hello_world hello_world ["Europe/Amsterdam"]
result: "Hello, Amsterdam it's 00:53:22.964238"
 elapsed time: 344.477878ms

```

Nice. Well done!
Let's see what happens when we get an error back:

```
3> call hello_world hello_world ["Europe/Amsterda"]
result: "{\\"error\\":\\"unknown location Europe/Amsterda\\"}"
 elapsed time: 268.301165ms

```

Ok, the error is handled although the return of a json string vs a string literal may not be the best way to do that. More on that later.

Next, we need to deploy our service to one or more peers.

**todo**: deal deploy

Now that we have deployed our service, it's time to tackle our Aqua script to interact with our distributed service.

In the project root, navigate to the `src/aqua.main` file and replace the template code with the following:

```
aqua Main

import App from "deployed.app.aqua"
import HelloWorld from "services/hello_world.aqua"
export App, hello_world

func hello_world(city: string) -> string:
    services <- App.services()
    on services.hello_world.default!.peerId:
        HelloWorld services.hello_world.default!.serviceId
        res <- HelloWorld.hello_world(city)
    <- res

```

```
$ fluence run
? Enter a function call that you want to execute hello_world("Europe/Amsterdam")
"Hello, Amsterdam it's 01:12:34.418336"        <- Expected result
Running:
  function: hello_world("Europe/Amsterdam")
  relay: /dns4/kras-09.fluence.dev/tcp/19001/wss/p2p/12D3KooWD7CvsYcpF9HE9CCV9aY3SJ317tkXVykjtZnht2EbzDPm... done

Result:

"\\"Hello, Amsterdam it's 01:12:34.418336\\"\\n"

```

Ignore the log output for a second and you'll see that got our expected result rather quickly:

```
"Hello, Amsterdam it's 01:12:34.418336"

```

And for completeness, let's check on our error prone request:

```
fluence run
? Enter a function call that you want to execute hello_world("Europe/Amsterda")
"{\\"error\\":\\"unknown location Europe/Amsterda\\"}"      <- Expected result
Running:
  function: hello_world("Europe/Amsterda")
  relay: /dns4/kras-01.fluence.dev/tcp/19001/wss/p2p/12D3KooWKnEqMfYo9zvfHmqTLpLdiHXPe4SVqUWcWHDJdFGrSmcA... done

Result:

"\\"{\\\\\\"error\\\\\\":\\\\\\"unknown location Europe/Amsterda\\\\\\"}\\"\\n"

```

All set! Of course, that's a pretty stylized example with not much use other than to demonstrate how to use the Fluence stack to quickly create, deploy and utilize distributed services. But, we're not far from a decent use case!

Imagine that you wanted to power multiple timezone clocks in your DAO frontend as a convenience to DAO users and an easy way to enforce proposal submission or voting cutoff times. Of course, you'd want the clocks to be as closely sync'ed as possible and calling our *hello_world* function multiple times in succession won't do. In fact, you want to execute the API calls in parallel bu as mentioned at the outset, our WASI modules are single threaded and can't provide the concurrent execution pattern you want. So instead of solving concurrency at the (Wasm) module level, we solve it at the choreography level with Aqua. Let's give it go knowing fully well that by using an unverified, centralized source. It is relatively trivial, however, to extend this example to guard against such shortcomings.

While our current *hello_world* function isn't optimal, it is certainly usable in our parallelization use case.

The details of Aqua's parallel execution flow is discussed in the [Aqua book](/docs/aqua-book/language/flow/parallel). 
Most simplistically, for each parallel branch we ant to execute, we need to have a corresponding service deploy. 
That is, for a list of, say, five timezones, we want to have five deployed services to provide true parallelization
of the requests. Now, the services may be deployed to five different peers or just one peer. 
From an availability and failover perspective, you want to deploy to different peers to avoid a single source
of failure, and we'll discuss that in more detail _below_.

Let's say we want to power three different timezones for our "world" clocks, so let's deploy two more service instances.

- *todo*: more deal deploy

With that out of the way, we can turn our attention to Aqua. Add the following to your `src/aqua.main` file:

*todo* to be completed

- parallelized run
