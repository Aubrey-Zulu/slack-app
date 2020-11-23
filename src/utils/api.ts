/* eslint-disable promise/always-return */
import { useEffect } from 'react';
import Deferred from './deferred';

interface Options {
  stateName: string;
  otherStatesToMonitor?: unknown[];
  setter: (arg: any) => void;
}

/**
 * 
 * @param getData 
 * @param {{
    stateName: string;
    otherStatesToMonitor?: unknown[];
    setter: (arg: x) => void;
  }} options 
  @return {void}
 */
export function useAsyncDataEffect(
  getData: () => Promise<any>,
  options: Options,
): void {
  let cancelled = false;
  const { setter, stateName } = options;
  useEffect(() => {
    const d = new Deferred();

    getData()
      .then((jsonData) => {
        if (cancelled) return;
        else d.resolve(jsonData);
      })
      .catch(d.reject);

    d.promise
      .then((data: any) => {
        if (!cancelled) {
          console.info(
            '%c Updating state: ' + stateName,
            'background: green; color: white; display: block;',
          );
          setter(data);
        }
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [...(options.otherStatesToMonitor || []), stateName]);
}
