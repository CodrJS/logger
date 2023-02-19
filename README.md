# @codrjs/logger

![npm version](https://img.shields.io/npm/v/@codrjs/logger)
[![CodeQL](https://github.com/CodrJS/logger/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/CodrJS/logger/actions/workflows/codeql.yml)

## Purpose

This module is to help facilitate creating and managing multiple winston loggers on the global level of each micro-service within Codr.

## Getting started

**<span style="color: dodgerblue">Important!</span>** By default, all loggers log to a `logs/combined.log` file and the console. There is no need to add these additional transports.

**Logging levels:**

0. error
1. warn
2. info
3. http
4. verbose
5. debug

**Log structure:**

All logs in every micro-service *should* look like this:

```ini
logs/
  [service]/
    all.log
    debug.log
    ...
  combined.log
```

### Installing the package

Install the package from the npm registry. You do not need to install `winston`. This package SHOULD take care of all logging needs.

```bash
yarn add @codrjs/logger
```

Inside the micro-service, you can get create a logger for each internal service you want to seperate.

```ts
/* Import the health package */
import Logger, { transports } from "@codrjs/logger";

const logger = Logger.add("Service 1", [
  new transports.File({
    filename: "logs/service-1/all.log",
  }),
  new transports.File({
    filename: "logs/service-1/debug.log",
    level: "debug",
  }),
]);

const otherLogger = Logger.add("Service 2", [
  new transports.File({
    filename: "logs/service-2/all.log",
  }),
  new transports.File({
    filename: "logs/service-2/debug.log",
    level: "debug",
  }),
]);

logger.info("Hello world!");
logger.debug("I'm a debug message");

otherLogger.info("Hello world!");
otherLogger.debug("I'm a debug message");

/**
Outputs:
  logs/combined.log
    2023-02-19 11:33:26:3326 [Service 1] [info] Hello world
    2023-02-19 11:33:26:3326 [Service 2] [info] Hello world

  logs/service-1/all.log
    2023-02-19 11:33:26:3326 [Service 1] [info] Hello world

  logs/service-1/debug.log
    2023-02-19 11:33:26:3326 [Service 1] [debug] I'm a debug message

  logs/service-2/all.log
    2023-02-19 11:33:26:3326 [Service 2] [info] Hello world

  logs/service-2/debug.log
    2023-02-19 11:33:26:3326 [Service 2] [debug] I'm a debug message
*/
```

## Todo:

- [ ] Implement daily rotating logs

## Contributing

```bash
# Clone the repo
git clone git@github.com:CodrJS/logger.git

# Install yarn if you don't have it already
npm install -g yarn

# Install dependencies, build, and test the code
yarn install
yarn build
yarn test
```
