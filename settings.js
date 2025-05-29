// 設定切換
import { showToast, saveToLocalStorage, loadFromLocalStorage } from "./utils.js";

export const STORAGE_KEY_SETTING = "chat-editor-setting";
export let setting = { isCounting: true, isCharacterLabel: true };

export function saveSetting() {
  saveToLocalStorage(STORAGE_KEY_SETTING, JSON.stringify(setting));
}

export function loadSetting() {
  const saved = loadFromLocalStorage(STORAGE_KEY_SETTING);
  if (saved) {
    const obj = JSON.parse(saved);
    setting.isCounting = obj.isCounting ?? true;
    setting.isCharacterLabel = obj.isCharacterLabel ?? true;
  }
}
