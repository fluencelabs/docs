# Signing service (plugin?)

# TODO: adapt to JS Client

Signing service is useful when you want to sign arbitrary data and pass it further inside a single Aqua script. Signing service allows one to restrict its usage for security reasons: e.g., if you don't want to sign anything except it comes from a trusted source. The Aqua side API is the following:

```aqua
data SignResult:
    -- Was call successful or not
    success: bool
    -- Error message. Will be null if the call is successful
    error: ?string
    -- Signature as byte array. Will be null if the call is not successful
    signature: ?[]u8

-- Available only on FluenceJS peers
-- The service can also be resolved by it's host peer id
service Sig("sig"):
    -- Signs data with the private key used by signing service.
    -- Depending on implementation the service might check call params to restrict usage for security reasons.
    -- By default signing service is only allowed to be used on the same peer the particle was initiated
    -- and accepts data only from the following sources:
    --   trust-graph.get_trust_bytes
    --   trust-graph.get_revocation_bytes
    --   registry.get_key_bytes
    --   registry.get_record_bytes
    --   registry.get_host_record_bytes
    -- Argument: data - byte array to sign
    -- Returns: signature as SignResult structure
    sign(data: []u8) -> SignResult

    -- Given the data and signature both as byte arrays, returns true if the signature is correct, false otherwise.
    verify(signature: []u8, data: []u8) -> bool

    -- Gets service's public key.
    get_pub_key() -> string
```

FluenceJS ships the service implementation as the JavaScript class:

```typescript
/**
 * Whether signing operation is allowed or not.
 * Implemented as a predicate of CallParams.
 */
export type SigSecurityGuard = (params: CallParams<"data">) => boolean;

export class Sig implements SigDef {
  private _keyPair: KeyPair;

  constructor(keyPair: KeyPair) {
    this._keyPair = keyPair;
  }

  /**
   * Security guard predicate
   */
  securityGuard: SigSecurityGuard;

  /**
   * Gets the public key of KeyPair. Required by aqua
   */
  get_pub_key() {
    // implementation omitted
  }

  /**
   * Signs the data using key pair's private key. Required by aqua
   */
  async sign(
    data: number[],
    callParams: CallParams<"data">
  ): Promise<SignResult> {
    // implementation omitted
  }

  /**
   * Verifies the signature. Required by aqua
   */
  verify(signature: number[], data: number[]): Promise<boolean> {
    // implementation omitted
  }
}
```

`securityGuard` specifies the way the `sign` method checks whether the incoming data is allowed to be signed or not. It accepts one argument: call params (see "Call params and tetraplets") and must return either true or false. Any predicate can be specified. Also, FluenceJS is shipped with a set of useful predicates:

```typescript
/**
 * Only allow calls when tetraplet for 'data' argument satisfies the predicate
 */
export const allowTetraplet = (pred: (tetraplet: SecurityTetraplet) => boolean): SigSecurityGuard => {/*...*/};

/**
 * Only allow data which comes from the specified serviceId and fnName
 */
export const allowServiceFn = (serviceId: string, fnName: string): SigSecurityGuard => {/*...*/};

/**
 * Only allow data originated from the specified json_path
 */
export const allowExactJsonPath = (jsonPath: string): SigSecurityGuard => {/*...*/};

/**
 * Only allow signing when particle is initiated at the specified peer
 */
export const allowOnlyParticleOriginatedAt = (peerId: PeerIdB58): SigSecurityGuard => {/*...*/};

/**
 * Only allow signing when all of the predicates are satisfied.
 * Useful for predicates reuse
 */
export const and = (...predicates: SigSecurityGuard[]): SigSecurityGuard => {/*...*/};

/**
 * Only allow signing when any of the predicates are satisfied.
 * Useful for predicates reuse
 */
export const or = (...predicates: SigSecurityGuard[]): SigSecurityGuard => {/*...*/};
};
```

Predicates as well as the `Sig` definition can be found in `@fluencelabs/fluence/dist/services`

The `Sig` class is accompanied by `registerSig`, which allows registering different signing services with different keys. The mechanism is exactly the same as with ordinary aqua services, e.g.:

```typescript
// create a key per from pk bytes
const customKeyPair = await KeyPair.fromEd25519SK(pkBytes);

// create a signing service with the specific key pair
const customSig = new Sig(customKeyPair);

// restrict sign usage to our needs
customSig.securityGuard = allowServiceFn("my_service", "my_function");

// register the service. Please note, that service id ("CustomSig" here) has to be specified.
registerSig("CustomSig", customSig);
```

```typescript
const peer = new FluencePeer();
await peer.start();

// ...

registerSig(peer, "CustomSig", customSig);
```

`FluencePeer` ships with the default signing service implementation, registered with id "Sig". Is is useful to work with TrustGraph and Registry API. The default implementation has the following restrictions on the `sign` operation:

- Only allowed to be used on the same peer the particle was initiated
- Restricts data to following services:
  - trust-graph.get_trust_bytes
  - trust-graph.get_revocation_bytes
  - registry.get_key_bytes
  - registry.get_record_bytes
  - Argument: data, a byte array to sign.

The default signing service class can be accessed in the following way:

```typescript
// for default FluencePeer:
const sig = Fluence.getPeer().getServices().sig;

// for non-default FluencePeer:
// const peer = FluencePeer();
// await peer.start()
const sig = peer.getServices().sig;

// change securityGuard for the default service:
sig.securityGuard = or(
  sig.securityGuard,
  allowServiceFn("my_service", "my_function")
);
```
