# Connecting To Local Data Storage

Like all serverless compute protocols, Fluence Lambda is an inherently stateless protocol and persistent data storage, e.g., to Ceramic or S3, is a complementary solution component developers integrate into their application stack. However, just like in AWS Lambda, Fluence Lambda provides ephemeral storage to developers that can be utilized during the course of a Lambda execution with no expectation of data durability beyond the Lambda execution.

Fluence Lambda Ephemeral Storage follows the common file-based (Rust) IO process and is implemented as a Wasm module using [MounteBinaries](https://fluence.dev/docs/marine-book/marine-runtime/mounted-binaries) similar to the curl-adapter module yu developed in the previous section.

Let's set up a new project with Fluence CLI using the minimal template and the default, i.e., *kras*, environment with `fluence init ephemeral-storage` and *cd* into the new directory. Recall that our first step in setting up our project is to create a new (Marine) service and the appropriate modules:

```bash
fluence init eph-storage
```
