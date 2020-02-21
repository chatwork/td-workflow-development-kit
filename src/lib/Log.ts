import * as logSymbols from 'log-symbols';
/* eslint-disable @typescript-eslint/no-explicit-any */

// 環境変数 TD_WDK_LOG の値が DEBUG 時のみログ出力
export function debug(message: any): void {
  if (process.env['TD_WDK_LOG'] !== 'DEBUG') return;
  console.log(`[Debug]${message}`);
  return;
}

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
