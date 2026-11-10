"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "rumamap-favorites";
const CHANGE_EVENT = "rumamap-favorites-change";
const INITIAL_FAVORITES = ["taman-senja", "taman-mentari"];
const INITIAL_SNAPSHOT = JSON.stringify(INITIAL_FAVORITES);

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

export function useFavoritePropertyIds() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return JSON.parse(snapshot);
}

export function toggleFavoriteProperty(propertyId) {
  const favoriteIds = JSON.parse(getSnapshot());
  const next = favoriteIds.includes(propertyId)
    ? favoriteIds.filter((id) => id !== propertyId)
    : [...favoriteIds, propertyId];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
