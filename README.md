# Introduction 

This repo host the website Online Codec, allowing the user to encode (generate downlink frames) or decode (parsing uplink frames into JSON) frames. 

# Demo

A demo website is available, hosted through Gitlab Pages, [here](https://tes.gitlab-pages.connect.te.com/iot/tools/website/online-codec/).


# How is it build

It is purely front-end, no server is used. All the coding/decoding is made on the browser, through Javascript. This architecture is on purpose, to allow the user to re-use the easily the source code on platform and to host this website on pure HTTP server.

## Framework

- React
- UI : Chakra UI, for all the components
- Decoding : Made with the official [TE TTN Decoder](https://gitlab.connect.te.com/tes/iot/tools/iot-applications/ttn-payload-formater). Included as a Git Submodule.
- Encoding : Made in Typescript.


## Available NPM Scripts

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

