// 計數器相關
import { showToast, saveToLocalStorage } from "./utils.js";

export let counter = 0;
export const STORAGE_KEY_COUNTER = "chat-editor-counter";

export function loadCounter() {
  const savedCounter = localStorage.getItem(STORAGE_KEY_COUNTER);
  if (savedCounter !== null) {
    counter = parseInt(savedCounter, 10);
  } else {
    counter = 0;
  }
}

export function setCounter(val, save = true) {
  counter = val;
  save && saveCounter();
}

export function saveCounter() {
  saveToLocalStorage(STORAGE_KEY_COUNTER, counter);
}

export function increaseCounter(save) {
  counter = Math.min(9999, counter + 1);
  if (counter === 9999) showToast("計數已達上限 9999");
  setCounter(counter, save);
}

export function decreaseCounter(save) {
  counter = counter - 1;
  if (counter < 0) {
    counter = 0;
    showToast("計數不能小於 0");
  }
  setCounter(counter, save);
}
