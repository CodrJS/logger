import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};
winston.addColors(colors);

class CodrLogger {
  private globalTransports = [
    new winston.transports.Console({
      format: winston.format.colorize({ message: false }),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ];

  add(module: string, transports: winston.transport[]) {
    if (!winston.loggers.has(module)) {
      winston.loggers.add(module, {
        transports: [...this.globalTransports, ...transports],
        levels,
        format: this.format(module),
      });
    }
    return this.get(module);
  }

  get(module: string) {
    return winston.loggers.get(module);
  }

  private format = (module: string) => {
    return winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      winston.format.label({ label: module }),
      winston.format.printf(
        info =>
          `${info.timestamp} [${info.label}] [${info.level}] ${info.message}`,
      ),
    );
  };
}

const Logger = new CodrLogger();
export const transports = winston.transports;
export default Logger;
