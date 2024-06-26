# Introduction 

This repo host the website Online Codec, allowing the user to encode (generate downlink frames) or decode (parsing uplink frames into JSON) frames. 

# Demo

A demo website is available, hosted through Github Pages, [here](https://teconnectivity.github.io/online-codec/).



## Framework

It is purely front-end, no server is used. All the coding/decoding is made on the browser, through Javascript. This architecture is on purpose, to allow the user to re-use the easily the source code on platform and to host this website on pure HTTP server.

- React
- UI : [Chakra UI](https://v2.chakra-ui.com/), for all the graphical components
- Decoding : Made with the official [TE TTN Decoder](https://github.com/TEConnectivity/ttn-decoder). Included as a Git Submodule.
- Encoding : Made in Typescript, part of this repository.


# API

This website can be used as-is, as a front-end application, or be used as an API through the encoding/decoding libraries. 

## Decoding

Just use the ```te_decoder()``` function from the [TE_TtnDecoder.js](src/submodules/ttn-payload-formater/TnnJsDecoder/TE_TtnDecoder.js) file.  

This function takes a *bytearray*  and the LoRa *fport* as input, and return a JSON containing decoded data. The JSON Schema of the output is not available. The output shall match the sensor's specification.

## Encoding 

This website use the TE Connectivity [iot-codec](https://github.com/TEConnectivity/iot-codec) NPM module to generate downlink frames.

# Supported sensors

Please update yours sensors to these firmware for the application to support them.

| Sensor        | Encoding | Decoding |
| ------------- | -------- | -------- |
| 8931  (4.0.1) | ❌        | ✅        |
| 8911  (4.0.1) | ❌        | ✅        |
| 59XX  (3.5.0) | ✅        | ✅        |
| 69XX  (3.5.0) | ✅        | ✅        |
| 79XX  (3.5.0) | ✅        | ✅        |



# Available NPM Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br /> Open
[http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br /> You will also see any lint errors
in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br /> See the section
about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br /> It correctly bundles
React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br /> Your app is
ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

