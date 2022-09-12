# Plugins

:::caution Experimental
:::

Plugins are an easy way to use local services written in JS in `aqua cli`. Let's have a look at how it works with an Aqua code example:

```aqua
-- struct that we want to return from a service
data Result:
    left: u32
    right: u32
    
-- service that returns 'Result' data
service ResultGetter("getter"):
    get() -> Result

-- service that can sum the result
service Adder("adder"):
    sum(r: Result) -> u64
    
-- a function that bundles the execution of services
func getAndSum() -> u64:
    result <- ResultGetter.get()
    sum <- Adder.sum(result)
    <- sum
```

We want to execute and check if the Aqua code works before we start to implement the service in Rust and deploy it to Fluence nodes. We can implement these services on JS. Files must be with `.mjs` extension and with this service scheme:

```javascript
// exported function name must be `plugins` without arguments
export function plugins() {
    return {
      // not service name!
      service_id: {
        // can be async
        function_name: () => { 
          // js code here
        }
      }
    }
}
```

Create two files for our example.

`getter.mjs`:

```javascript
export function plugins() {
    return {
      getter: {
        get: () => { 
          return {
            left: 12,
            right: 32
          }
        }
      }
    }
}
```

`adder.mjs`:

```javascript
export function plugins() {
    return {
      adder: {
        sum: (result) => { 
          return result.left + result.right
        }
      }
    }
}
```

Run Aqua code with Aqua CLI:

```sh
aqua run -f 'getAndSum()' -i path/to/aqua --addr node/addr --plugin adder.mjs --plugin getter.mjs
44
```

Also, it is possible to move all plugin files to one directory and target this directory `--plugin path/to/dir`