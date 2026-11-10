"use client";

import { useSyncExternalStore } from "react";
import { demoApplications } from "./applications";
import { demoProperties } from "./properties";

const STORAGE_KEY = "rumamap-demo-data-v1";
const CHANGE_EVENT = "rumamap-demo-data-change";
const INITIAL_DATA = {
  properties: demoProperties,
  applications: demoApplications,
};
const INITIAL_SNAPSHOT = JSON.stringify(INITIAL_DATA);

function subscribe(listener) {
  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? INITIAL_SNAPSHOT;
}

function getServerSnapshot() {
  return INITIAL_SNAPSHOT;
}

export function useDemoData() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return JSON.parse(snapshot);
}

export function updateDemoData(updater) {
  const current = JSON.parse(getSnapshot());
  const next = updater(current);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
