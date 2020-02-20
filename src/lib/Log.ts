import * as logSymbols from 'log-symbols';
/* eslint-disable @typescript-eslint/no-explicit-any */

export function log(message: any): void {
  console.log(message);
  return;
}

export function success(message: any): void {
  console.info(logSymbols.success, message);
  return;
}

export function error(message: any, error: Error): void {
  console.error(logSymbols.error, message);
  console.log();
  throw error;
}
