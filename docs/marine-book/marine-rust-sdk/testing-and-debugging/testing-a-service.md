import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Testing a service

The `#[marine_test]` macro also allows testing data flow between multiple services, so you do not need to deploy anything to the network and write an Aqua app just for basic testing. Let's look at an example:

<Tabs>
<TabItem value="test.rs" label="test.rs" default>

```rust
fn main() {}

#[cfg(test)]
mod tests {
    use marine_rs_sdk_test::marine_test;
    #[marine_test( // 1
        producer(
            config_path = "../producer/Config.toml", 
            modules_dir = "../producer/artifacts"
        ),
        consumer(
            config_path = "../consumer/Config.toml",
            modules_dir = "../consumer/artifacts"
        )
    )]
    fn test() {
        let mut producer = marine_test_env::producer::ServiceInterface::new(); // 2
        let mut consumer = marine_test_env::consumer::ServiceInterface::new();
        let input = marine_test_env::producer::Input { // 3
            first_name: String::from("John"),
            last_name: String::from("Doe"),
        };
        let data = producer.produce(input); // 4
        let result = consumer.consume(data);
        assert_eq!(result, "John Doe")
    }
}
```

</TabItem>
<TabItem value="producer.rs" label="producer.rs" default>

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();

pub fn main() {}

#[marine]
pub struct Data {
    pub name: String,
}

#[marine]
pub struct Input {
    pub first_name: String,
    pub last_name: String,
}

#[marine]
pub fn produce(data: Input) -> Data {
    Data {
        name: format!("{} {}", data.first_name, data.last_name),
    }
}
```

</TabItem>
<TabItem value="consumer.rs" label="consumer.rs" default>

```rust
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;

module_manifest!();

pub fn main() {}

#[marine]
pub struct Data {
    pub name: String,
}

#[marine]
pub fn consume(data: Data) -> String {
    data.name
}
```

</TabItem>
<TabItem value="test_on_mod.rs" label="test_on_mod.rs" default>

```rust
fn main() {}

#[cfg(test)]
#[marine_rs_sdk_test::marine_test(
    producer(
        config_path = "../producer/Config.toml",
        modules_dir = "../producer/artifacts"
    ),
    consumer(
        config_path = "../consumer/Config.toml",
        modules_dir = "../consumer/artifacts"
    )
)]
mod tests_on_mod {
    #[test]
    fn test() {
        let mut producer = marine_test_env::producer::ServiceInterface::new();
        let mut consumer = marine_test_env::consumer::ServiceInterface::new();
        let input = marine_test_env::producer::Input {
            first_name: String::from("John"),
            last_name: String::from("Doe"),
        };
        let data = producer.produce(input);
        let result = consumer.consume(data);
        assert_eq!(result, "John Doe")
    }
}
```

</TabItem>
</Tabs>

1. We wrap the `test` function with the `marine_test` macro by providing named service configurations with module locations. Based on its arguments the macro defines a `marine_test_env` module with an interface to the services.
2. We create new services. Each `ServiceInterface::new()` runs a new marine runtime with the service.
3. We prepare data to pass to a service using structure definition from `marine_test_env`. The macro finds all structures used in the service interface functions and defines them in the corresponding submodule of `marine_test_env`.
4. We call a service function through the `ServiceInterface` object.
5. It is possible to use the result of one service call as an argument for a different service call. The interface types with the same structure have the same rust type in `marine_test_env`.

In the `test_on_mod.rs` tab we can see another option — applying `marine_test` to a `mod`. The macro just defines the `marine_test_env` at the beginning of the module and then it can be used as usual everywhere inside the module.

The full example is [here](https://github.com/fluencelabs/marine/tree/master/examples/multiservice_marine_test).

The `marine_test` macro also gives access to the interface of internal modules which may be useful for setting up a test environment. This feature is designed to be used in situations when it is simpler to set up a service for a test through internal functions than through the service interface. To illustrate this feature we have rewritten the previous example:

```rust
fn main() {}

#[cfg(test)]
mod tests {
    use marine_rs_sdk_test::marine_test;
    #[marine_test(
        producer(
            config_path = "../producer/Config.toml",
            modules_dir = "../producer/artifacts"
        ),
        consumer(
            config_path = "../consumer/Config.toml",
            modules_dir = "../consumer/artifacts"
        )
    )]
    fn test() {
        let mut producer = marine_test_env::producer::ServiceInterface::new();
        let mut consumer = marine_test_env::consumer::ServiceInterface::new();
        let input = marine_test_env::producer::modules::producer::Input { // 1
            first_name: String::from("John"),
            last_name: String::from("Doe"),
        };
        let data = producer.modules.producer.produce(input); // 2
        let consumer_data = marine_test_env::consumer::modules::consumer::Data { name: data.name } // 3;
        let result = consumer.modules.consumer.consume(consumer_data); 
        assert_eq!(result, "John Doe")
    }
}
```

1. We access the internal service interface to construct an interface structure. To do so, we use the following pattern: `marine_test_env::$service_name::modules::$module_name::$structure_name`.
2. We access the internal service interface and directly call a function from one of the modules of this service. To do so, we use the following pattern: `$service_object.modules.$module_name.$function_name` .
3. In the previous example, the same interface types had the same rust types. It is limited when using internal modules: the property is true only when structures are defined in internal modules of one service, or when structures are defined in service interfaces of different services. So, we need to construct the proper type to pass data to the internals of another module.

