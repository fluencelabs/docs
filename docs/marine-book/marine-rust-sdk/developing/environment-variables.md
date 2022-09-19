# Environment variables

The `Marine` runtime sets some environment variables for each loaded module:

* `service_id` contains id of a current service
* `local` -  contains a full path to the `local` directory
* `tmp` - contains a full path to the `tmp` directory

Additionally, the runtime adds one variable for each mounted binary import specified in a configuration file, this variable contains a specified in the config file path to a mounted CLI binary.

Environment variables could be seen with the Marine REPL, more details [here](../../marine-tooling-reference/marine-repl.md#envs-show-environment-variables-of-a-module). From the code perspective, such variables could be obtained with the standard Rust [std::env](https://doc.rust-lang.org/std/env/index.html) mechanism.
