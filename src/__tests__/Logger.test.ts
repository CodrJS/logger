import { readFileSync } from "fs";
import winston from "winston";
import Logger from "..";

// create loggers
const loggerA = Logger.add("Module A", [
  new winston.transports.File({
    filename: "logs/test/moduleA/all.log",
  }),
  new winston.transports.File({
    filename: "logs/test/moduleA/debug.log",
    level: "debug",
  }),
]);

const loggerB = Logger.add("Module B", [
  new winston.transports.File({
    filename: "logs/test/moduleB/all.log",
  }),
  new winston.transports.File({
    filename: "logs/test/moduleB/debug.log",
    level: "debug",
  }),
]);

// log to files
loggerA.info('Module A say\'s "Hello world"');
loggerA.debug('Module A say\'s "Hello debug"');
loggerB.info('Module B say\'s "Hello world"');
loggerB.debug('Module B say\'s "Hello debug"');

// wait a second for the logger to append to the files.
await new Promise(resolve => setTimeout(resolve, 1000));

// fetch the files.
const moduleAInfoFile = readFileSync("logs/test/moduleA/all.log", {
  encoding: "utf-8",
});
const moduleADebugFile = readFileSync("logs/test/moduleA/debug.log", {
  encoding: "utf-8",
});
const moduleBInfoFile = readFileSync("logs/test/moduleB/all.log", {
  encoding: "utf-8",
});
const moduleBDebugFile = readFileSync("logs/test/moduleB/debug.log", {
  encoding: "utf-8",
});
const combinedLog = readFileSync("logs/combined.log", {
  encoding: "utf-8",
});

// run the tests
describe("Module A", () => {
  it("logs to the global combined log", () => {
    expect(combinedLog).toMatch(/Module A say's "Hello world"/i);
  });

  it("logs to the info file", () => {
    expect(moduleAInfoFile).toMatch(/Module A say's "Hello world"/i);
  });

  it("logs to the debug file", () => {
    const debugLogContainsMessage = /Module A say's "Hello debug"/i.test(
      moduleADebugFile,
    );
    expect(debugLogContainsMessage).toEqual(true);
  });

  it("does not log debug to the combined file", () => {
    const globalContainsDebugMessage = /Module A say's "Hello debug"/i.test(
      combinedLog,
    );
    expect(globalContainsDebugMessage).toEqual(false);
  });
});

describe("Module B", () => {
  it("logs to the global combined log", () => {
    expect(combinedLog).toMatch(/Module B say's "Hello world"/i);
  });

  it("logs to the info file", () => {
    expect(moduleBInfoFile).toMatch(/Module B say's "Hello world"/i);
  });

  it("logs to the debug file", () => {
    const debugLogContainsMessage = /Module B say's "Hello debug"/i.test(
      moduleBDebugFile,
    );
    expect(debugLogContainsMessage).toEqual(true);
  });

  it("does not log debug to the combined file", () => {
    const globalContainsDebugMessage = /Module B say's "Hello debug"/i.test(
      combinedLog,
    );
    expect(globalContainsDebugMessage).toEqual(false);
  });
});
