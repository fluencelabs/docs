import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# IValue & IType

`IValue` and `IType` are central pillars of passing values between modules and between a module and a host. Their main purpose is to allow developer not to think how this passing works internally and just use these handy enums.

<Tabs>
<TabItem value="IValue" label="IValue" default>

```rust
/// Represents values supported by interface-types.
pub enum IValue {
    Boolean(bool),
    S8(i8),
    S16(i16),
    S32(i32),
    S64(i64),
    U8(u8),
    U16(u16),
    U32(u32),
    U64(u64),
    F32(f32),
    F64(f64),
    String(String),
    ByteArray(Vec<u8>), // specialization of Array for better performance
    Array(Vec<IValue>),
    I32(i32),
    I64(i64),
    Record(NEVec<IValue>),
}
```

</TabItem>
<TabItem value="IType" label="IType" default>

```rust
/// Represents types supported by IT.
pub enum IType {
    Boolean,
    S8,
    S16,
    S32,
    S64,
    U8,
    U16,
    U32,
    U64,
    F32,
    F64,
    String,
    ByteArray, // specialization of Array for better performance
    Array(Box<IType>),
    I32,
    I64,
    Record(u64),
}
```

</TabItem>
</Tabs>
