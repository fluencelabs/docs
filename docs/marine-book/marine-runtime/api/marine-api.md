import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Marine API

FaaS layer is based on the runtime Marine component significantly expanding it by providing a few ways of its instantiation as well as calling with JSON values.

## Instantiation

<Tabs>
<TabItem value="with_raw_config" label="with_raw_config" default>

```rust
fn with_raw_config<C>(config: C) -> FaaSResult<Self>
    where
        C: TryInto<FaaSConfig>,
        FaaSError: From<C::Error>,
```

</TabItem>
<TabItem value="with_modules" label="with_modules" default>

```rust
fn with_modules<C>(mut modules: HashMap<String, Vec<u8>>, config: C) -> FaaSResult<Self>
    where
        C: TryInto<FaaSConfig>,
        FaaSError: From<C::Error>,
```

</TabItem>
<TabItem value="with_module_names" label="with_module_names" default>

```rust
fn with_module_names<C>(names: &HashMap<String, String>, config: C) -> FaaSResult<Self>
    where
        C: TryInto<FaaSConfig>,
        FaaSError: From<C::Error>,
```

</TabItem>
</Tabs>

Creates a FaaS instance from the provided config and modules or just module names.

## Calling a module

<!-- cSpell:ignore ivalues -->

<Tabs>
<TabItem value="call_with_ivalues" label="call_with_ivalues" default>

```rust
fn call_with_ivalues(
    &mut self,
    module_name: impl AsRef<str>,
    func_name: impl AsRef<str>,
    args: &[IValue],
    call_parameters: marine_rs_sdk::CallParameters,
) -> FaaSResult<Vec<IValue>>
```

</TabItem>
<TabItem value="call_with_json" label="call_with_json" default>

```rust
fn call_with_json(
    &mut self,
    module_name: impl AsRef<str>,
    func_name: impl AsRef<str>,
    json_args: JValue,
    call_parameters: marine_rs_sdk::CallParameters,
) -> FaaSResult<JValue>
```

</TabItem>
</Tabs>

Invokes a function of a module inside Marine by given function name with given arguments. For more info about `IValue` take a look to [this](./../i-value-and-i-type.md) chapter.

## Getting a module interface

<Tabs>
<TabItem value="get_interface" label="get_interface" default>

```rust
fn get_interface(&self) -> FaaSInterface<'_>
```

</TabItem>
<TabItem value="FaaSInterface" label="FaaSInterface" default>

```rust
struct FaaSInterface<'a> {
    pub modules: HashMap<&'a str, FaaSModuleInterface<'a>>,
}

struct FaaSInterface<'a> {
    pub modules: HashMap<&'a str, FaaSModuleInterface<'a>>,
}

struct MModuleInterface<'a> {
    pub record_types: &'a MRecordTypes,
    pub function_signatures: Vec<MFunctionSignature>,
}

type MRecordTypes = HashMap<u64, Rc<IRecordType>>;

struct MFunctionSignature {
    pub name: Rc<String>,
    pub arguments: Rc<Vec<IFunctionArg>>,
    pub outputs: Rc<Vec<IType>>,
}
```

</TabItem>
</Tabs>

This method returns a public interface of a module, i.e. a set of all public functions and records.

## Getting module memory stats

<Tabs>
<TabItem value="module_memory_stats" label="module_memory_stats" default>

```rust
fn module_memory_stats(&self) -> MemoryStats<'_>
```

</TabItem>
<TabItem value="MemoryStats" label="MemoryStats" default>

```rust
struct MemoryStats<'module_name>(pub Vec<ModuleMemoryStat<'module_name>>);

/// Contains module name and a size of its linear memory in bytes.
/// Please note that linear memory contains not only heap, but globals, shadow stack and so on.
/// Although it doesn't contain operand stack, additional runtime (Wasmer) structures,
/// and some other stuff, that should be count separately.
struct ModuleMemoryStat<'module_name> {
    pub name: &'module_name str,
    pub memory_size: usize,
    // None if memory maximum wasn't set
    pub max_memory_size: Option<usize>,
}
```

</TabItem>
</Tabs>

Returns a statistics of memory usage for all loaded modules.
