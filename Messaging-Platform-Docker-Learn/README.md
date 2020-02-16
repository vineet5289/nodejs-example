# Messaging-Platform-API

This is the Messaging Platform API for Public Connect. If you are new to this project read this file before starting development.

The messaging api development server is hosted [here](https://dev-messaging-api.azurewebsites.net)

## Running in Dev Environment

- `npm run dev` to start the local dev api server on [localhost:5200](http://localhost:5200).localhost:5000) for Auth0 login.
- `npm run test` to run all tests once.
- `npm run test-watch` to run jest in watch mode.
- `npm run build` to compile TypeScript.


## Building

Please make sure your feature/bugfix works using the production build before making a PR. To do this, follow these steps:

1. `npm run build` to build the app in the `dist` folder.
2. Make sure the feature/bugfix works in the production build.
