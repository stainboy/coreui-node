# NodeJS backend for CoreUI
`coreui-node` is a tiny application serves as the start point of Micro-service developed in NodeJS. 

## How to use this project?
Just clone it to where your project starts with. Change the project name and other parameters and then use it as the start point of your application.

## What is the capability of this project?
- Serves data services via REST API
- Persist data in mongodb
- Form authentication
- Redis based session management
- Express application
- Full featured CI support

## Prerequsites
- [NodeJS 10+](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Docker (optional for running mongodb locally)](https://docs.docker.com/install/)
- [Compose (optional for running mongodb locally)](https://docs.docker.com/compose/install/)

## How to start locally?
First, start backing services (e.g. mongo and redis). Refer [./mock/README.md](./mock/)
```bash
$ yarn install
$ yarn start
```

Then open browser and visit http://localhost:3000

## How to run test?
```bash
$ yarn test
```
