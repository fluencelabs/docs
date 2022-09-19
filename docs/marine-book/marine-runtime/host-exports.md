# Host exports

`Host export` is a function exported from a host and accessible by a Wasm module. Without interface-types it's not so easy to make a convenient API without the necessity for a developer to think about some low-level details (such as memory allocation for passing complex data types).

`Marine` makes the development of such functions a trivial task. Each of such functions should be registered in the runtime config with `HostImportDescriptor`.

```rust
pub type HostExportedFunc = Box<dyn Fn(&mut Ctx, Vec<IValue>) -> Option<IValue> + 'static>;

pub struct HostImportDescriptor {
    /// This closure will be invoked for corresponding import.
    pub host_exported_func: HostExportedFunc,

    /// Type of the closure arguments.
    pub argument_types: Vec<IType>,

    /// Types of output of the closure.
    pub output_type: Option<IType>,

    /// If Some, this closure is called with an error when errors are encountered while lifting.
    /// If None, panic will occur.
    pub error_handler: Option<Box<dyn Fn(&HostImportError) -> Option<IValue> + 'static>>,
}
```

And that is how a real-world [host exports](https://github.com/fluencelabs/marine/blob/1aeb9b70b573425c6d9f738b94cc35fbdf5aac58/marine/src/host_imports/mounted_binaries.rs#L25) looks like:

```rust
pub(crate) fn create_mounted_binary_import(mounted_binary_path: PathBuf) -> HostImportDescriptor {
    let host_cmd_closure = move |_ctx: &mut Ctx, raw_args: Vec<IValue>| {
        let result =
            mounted_binary_import_impl(&mounted_binary_path, raw_args).unwrap_or_else(Into::into);

        let raw_result = crate::to_interface_value(&result).unwrap();

        Some(raw_result)
    };

    HostImportDescriptor {
        host_exported_func: Box::new(host_cmd_closure),
        argument_types: vec![IType::Array(Box::new(IType::String))],
        output_type: Some(IType::Record(0)),
        error_handler: None,
    }
}
```

Take a look at how `host_cmd_closure` is defined, it has two arguments: `Ctx` could be used for some low-level stuff, while `args` represents closure arguments and it's an array of [IValue](i-value-and-i-type.md), which could be handled in a handy way then. The result of the closure is `Option<IValue>`, and resulted [IValue](i-value-and-i-type.md) could be easily constructed with a special function `to_interface_value`.

And that's it! Just handle arguments, convert the result to IValue, and provide a descriptor!
