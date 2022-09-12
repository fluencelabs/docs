# Call parameters

There is a special API function `marine_rs_sdk::get_call_parameters()` that returns an instance of the `CallParameters` structure defined as follows:

```rust
pub struct CallParameters {
    /// Peer id of the AIR script initiator.
    pub init_peer_id: String,

    /// Id of the current service.
    pub service_id: String,

    /// Id of the service creator.
    pub service_creator_peer_id: String,

    /// Id of the host which run this service.
    pub host_id: String,

    /// Id of the particle which execution resulted a call this service.
    pub particle_id: String,

    /// Security tetraplets which described origin of the arguments.
    pub tetraplets: Vec<Vec<SecurityTetraplet>>,
}
```

This structure contains vital for Fluence service fields, which allow to find out varied information about a source of a service call.

One of the most common patterns of `CallParameters` usage is authentication services:

```rust
use marine_rs_sdk::marine;

pub fn is_owner() -> bool {
    let meta = marine_rs_sdk::get_call_parameters();
    let caller = meta.init_peer_id;
    let owner = meta.service_creator_peer_id;

    caller == owner
}

#[marine]
pub fn am_i_owner() -> bool {
    is_owner()
}
```
