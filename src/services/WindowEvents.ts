import { useEffect } from "react";

export interface WindowMessage {
  type: string;
  payload?: any;
}

const emitWindowEvent = (eventMessage: WindowMessage) => {
  const parentWindow = window.parent;
  parentWindow.postMessage(eventMessage, '*');
};

const useWindowEvent = (
  type: string,
  callback: ({ type, payload }: WindowMessage) => void,
  dependencies: any[] = [],
) => {
  useEffect(() => {
    const listener = (e: MessageEvent<WindowMessage>) => {
      if (e.data.type === type) {
        callback(e.data);
      }
    }

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    }
  }, [type, dependencies]);
}

export { emitWindowEvent, useWindowEvent };
