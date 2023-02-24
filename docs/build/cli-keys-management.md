### **Manage keys**

In order for Fluence CLI to be able to communicate with peers in Fluence’s peer-to-peer network a local, one-shot client peer is created. In order to be able to facilitate secure communication with other peers using end-to-end encryption over libp2p or optionally secure service API functions, a client needs a pair of cryptographic keys just like any other (libp2p) peer. Also note that a peer’s *peer id* is derived from the public key of its key pair.

Fluence CLI maintains a `users-secret.yaml` file in its global `~/.fluence` directory with a key pair as the default for all your projects:

```bash
cat user-secrets.yaml
# yaml-language-server: $schema=schemas/user-secrets.yaml.json

# Defines user's secret keys that can be used across different Fluence projects. You can manage user's keys using commands from `fluence key` group of commands with `--user` flag

# Documentation: https://github.com/fluencelabs/fluence-cli/tree/main/docs/configs/user-secrets.md

version: 0
keyPairs:
  - peerId: 12D3KooWDJ7XQBqy6rwPseEAQhaRKX6ZWjpLUcDcBoEQ1Lmdbnvb
    secretKey: Rdm8roRWsNqwN/4trrvkHcAhhmv9oaXFIxmhj+Wsa7U=
    publicKey: CAESIDOuw/xI1AD9K/wcqd/92SX2vsAe9+eDdFDTKZnadZpI
    name: auto-generated
defaultKeyPairName: auto-generated
```

If you want or need to, you can create project-specific keys which are stored in the `/<your cli project>/.fluence/project-secrets.yaml`.  In your Fluence CLI project directory:

```bash
fluence key new

? Enter key-pair name to generate at ~/localdev/hello-world/.fluence/project-secrets.yaml
? Enter key-pair name to generate at ~/localdev/hello-world/.fluence/project-secrets.yaml
? Do you want to set  as default key-pair for ~/localdev/hello-world/.fluence/project-secrets.yaml Yes
Key-pair with name  successfully generated and saved to ~/localdev/hello-world/.fluence/project-secrets.yaml
```

Let’s check the config file for the update:

```bash
cat .fluence/project-secrets.yaml
# yaml-language-server: $schema=schemas/project-secrets.yaml.json

# Defines project's secret keys that are used only in the scope of this particular Fluence project. You can manage project's keys using commands from `fluence key` group of commands

# Documentation: https://github.com/fluencelabs/fluence-cli/tree/main/docs/configs/project-secrets.md

version: 0
keyPairs:
  [
    {
        peerId: 12D3KooWDNii7w41s7tULorD5MgeZLK87v92nTvSC8dDNopj56Hx,
        secretKey: gpiGaGhXitP4S0AZEC9E0n09hb87sSSgEX68HvcQZOM=,
        publicKey: CAESIDTc31ZSsdl+iwCX2dbmADhRr23edTGRszDxXWY/K98r,
        name: ""
      }
  ]
defaultKeyPairName: ""
```

Of course, you can also a key pair:

```bash
fluence key remove
 ›   Warning: Key-pair name must be selected
? Do you want to remove ? Yes
Key-pair with name  successfully removed from ~/localdev/hello-world/.fluence/project-secrets.yaml
```

Let’s check:

```bash
cat .fluence/project-secrets.yaml
# yaml-language-server: $schema=schemas/project-secrets.yaml.json

# Defines project's secret keys that are used only in the scope of this particular Fluence project. You can manage project's keys using commands from `fluence key` group of commands

# Documentation: https://github.com/fluencelabs/fluence-cli/tree/main/docs/configs/project-secrets.md

version: 0
keyPairs: []
```