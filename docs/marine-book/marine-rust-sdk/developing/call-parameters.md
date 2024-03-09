# Call parameters

There is a special API function `marine_rs_sdk::get_call_parameters()` that returns an instance of the `CallParameters` structure defined as follows:

```rust
pub struct CallParameters {
    /// Parameters of the particle that caused this call.
    pub particle: ParticleParameters,

    /// Id of the current service.
    pub service_id: String,

    /// Id of the service creator.
    pub service_creator_peer_id: String,

    /// PeerId of the peer who hosts worker with this service.
    pub host_id: String,

    /// PeerId of the worker who hosts this service.
    pub worker_id: String,

    /// Security tetraplets which described origin of the arguments.
    pub tetraplets: Vec<Vec<SecurityTetraplet>>,
}


pub struct SecurityTetraplet {
    /// Id of a peer where corresponding value was set.
    pub peer_pk: String,

    /// Id of a service that set corresponding value.
    pub service_id: String,

    /// Name of a function that returned corresponding value.
    pub function_name: String,

    /// Value was produced by applying this `lens` to the output from `call_service`.
    pub lens: String,
}

pub struct ParticleParameters {
    /// Id of the particle which execution resulted a call this service.
    pub id: String,

    /// Peer id of the AIR script initiator.
    pub init_peer_id: String,

    /// Unix timestamp of the particle start time.
    pub timestamp: u64,

    /// Time to live for this particle in milliseconds.
    pub ttl: u32,

    /// AIR script in this particle.
    pub script: String,

    /// Signature made by particle initiator -- init_peer_id.
    pub signature: Vec<u8>,

    /// particle.signature signed by host_id -- used for FS access.
    pub token: String,
}
```

This structure contains vital for Fluence service fields, which allow to find out varied information about a source of a service call.

One of the most common patterns of `CallParameters` usage is authentication services:

```rust
use marine_rs_sdk::marine;

pub fn is_owner() -> bool {
    let meta = marine_rs_sdk::get_call_parameters();
    let caller = meta.particle.init_peer_id;
    let owner = meta.service_creator_peer_id;

    caller == owner
}

#[marine]
pub fn am_i_owner() -> bool {
    is_owner()
}
```
