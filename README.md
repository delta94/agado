# Agado
[![Build Status](https://travis-ci.org/phonxvzf/agado.svg?branch=master)](https://travis-ci.org/phonxvzf/agado)
[![codecov](https://codecov.io/gh/phonxvzf/agado/branch/master/graph/badge.svg)](https://codecov.io/gh/phonxvzf/agado)

This has nothing to do with the online hotel reservation system [Agoda](https://www.agoda.com).

## Installation
```shell
$ npm install
```

## Building
To compile TypeScript source code:
```shell
$ npm run build
```

## Starting the server
```shell
# The source code must have been compiled (with npm run build)
$ npm start
```

## Testing
```shell
# Run normal tests
$ npm run test

# Run tests with code coverage collection
$ npm run test-coverage
```

## API Documentation
Though not fully detailed, it is available in Swagger.
```shell
$ docker-compose up
```

You can also just put the `swagger` container up if you are not going to try out the API.

Navigate to `http://localhost:9999` for swagger-ui.
