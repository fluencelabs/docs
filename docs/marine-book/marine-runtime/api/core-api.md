import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Core API

This chapter briefly describes the API of the lowest layer of `Marine`. This layer is intended to provide the most basic API for module handling. The most functionality could be tested with a help of the Marine [REPL](../../marine-tooling-reference/marine-repl.md).

## Calling a module

```rust
fn call(
        &mut self,
        module_name: impl AsRef<str>,
        func_name: impl AsRef<str>,
        arguments: &[IValue],
    ) -> MResult<Vec<IValue>>
```

Invokes a function of a module inside Marine by given function name with given arguments. For more info about `IValue` take a look to [this](./../i-value-and-i-type.md) chapter.

## Loading a module

```rust
fn load_module(
        &mut self,
        name: impl Into<String>,
        wasm_bytes: &[u8],
        config: MModuleConfig,
    ) -> MResult<()>
```

Loads a new module with the provided config inside Marine. All modules should have unique names. This config allows you to flexible adjusting of the behavior of the loaded module, it has the following structure:

```rust
struct MModuleConfig {
    /// Maximum number of Wasm memory pages that loaded module can use.
    /// Each Wasm page is 65536 bytes long.
    pub max_heap_pages_count: u32,

    /// Import object that will be used in the module instantiation process.
    pub raw_imports: ImportObject,

    /// Imports from the host side that will be used in the module instantiation process.
    pub host_imports: HashMap<String, HostImportDescriptor>,

    /// Desired WASI version.
    pub wasi_version: WasiVersion,

    /// Environment variables for loaded modules.
    pub wasi_envs: HashMap<Vec<u8>, Vec<u8>>,

    /// List of available directories for loaded modules.
    pub wasi_preopened_files: HashSet<PathBuf>,

    /// Mapping between paths.
    pub wasi_mapped_dirs: HashMap<String, PathBuf>,
}
```

## Unloading a module

```rust
fn unload_module(&mut self, name: impl AsRef<str>) -> MResult<()>
```

Unloads a module from Marine by name. Use it carefully. It could crash service after the call if the module that linked with another will be unloaded.

## Getting a WASI state

```rust
fn module_wasi_state(
        &mut self,
        module_name: impl AsRef<str>,
    ) -> Option<&wasmer_wasi::state::WasiState>
```

Returns a WASI state of a module.

## Getting a module interface

<Tabs>
<TabItem value="Interface" label="interface" default>

```rust
fn interface(&self)
    -> impl Iterator<Item = (&str, MModuleInterface<'_>)>

fn module_interface(&self, module_name: impl AsRef<str>)
    -> Option<MModuleInterface<'_>>
    
fn module_record_types(&self, module_name: impl AsRef<str>)
    -> Option<&MRecordTypes>
    
fn module_record_type_by_id(
        &self,
        module_name: impl AsRef<str>,
        record_id: u64,
    ) -> Option<&Rc<IRecordType>>
```

</TabItem>
<TabItem value="ModuleInterface" label="MModuleInterface" default>

```rust
struct MModuleInterface<'a> {
    pub record_types: &'a MRecordTypes,
    pub function_signatures: Vec<MFunctionSignature>,
}

type MRecordTypes = HashMap<u64, Rc<IRecordType>>

struct MFunctionSignature {
    pub name: Rc<String>,
    pub arguments: Rc<Vec<IFunctionArg>>,
    pub outputs: Rc<Vec<IType>>,
}
```

</TabItem>
</Tabs>

These methods returns a public interface of a module, i.e. a set of all public functions and records.

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
