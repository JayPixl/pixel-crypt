# pixel-crypt

\>\> [Live demo](https://pixel-crypt-demo.vercel.app/) <<

## Description

Pixel-crypt is an encryption package for encoding strings. (It even works with emojis and other special characters! 😜)
You provide it an alphanumeric "key", and it generates an encoded string of numbers and letters.
You can store this "Pixel" and decrypt it later using that handy key you used before!

> Note! Pixel-crypt is not guaranteed to be secure as it has not been extensively tested for security. Do not use for important sensitive data, instead use UUIDs or Node's crypto library.

### Possible Uses:

- End-to-end message encryption
- Securing passwords or other secret data
- Encoding private notes on your personal device

The key you enter into the algorithm is turned into a string of numbers, and procedurally modified against itself to create a unique seed.
This seed contains the instructions for the algorithm to mash up the string you input.
Because the seed is unique and repeatable, the instructions can be used backwards to unhash an encrypted string.

## Documentation

### Installation

Type this command into your terminal in your project.

```
npm i pixel-crypt
```

### Usage

Import the package into your project.

```ts
import { pixelate, unpixelate } from 'pixel-crypt'
```

How to use these two functions:

```ts
// To encrypt
const { pixel, error } = pixelate("Sample String", "MyKey")

if (error) console.error(error)
else console.log(pixel)


// To decrypt
const { result, error } = unpixelate(pixel, "MyKey")

if (error) console.error(error)
else console.log(result)
```


#### *Hope you enjoy using this package!*