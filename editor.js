// 編輯器操作
import {
  showToast,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "./utils.js";

export const STORAGE_KEY = "chat-editor-content";

export function saveEditorContent() {
  const content = $("#editor").val();
  saveToLocalStorage(STORAGE_KEY, content);
  showSaveIndicator();
}

export function loadEditorContent() {
  const content = loadFromLocalStorage(STORAGE_KEY);
  if (content !== null) {
    $("#editor").val(content);
    showToast("已載入暫存內容");
  } else {
    showToast("沒有可載入的內容");
  }
}

export function clearEditorContent() {
  $("#editor").val("");
  saveToLocalStorage(STORAGE_KEY, "");
  showToast("已清除內容");
}

export function showSaveIndicator() {
  const el = $("#saveIndicator");
  el.addClass("active");
  setTimeout(() => el.removeClass("active"), 1000);
}

export function moveCursor(offset) {
  const textarea = $("#editor")[0];
  const pos = textarea.selectionStart;
  const newPos = Math.max(0, Math.min(pos + offset, textarea.value.length));
  textarea.setSelectionRange(newPos, newPos);
  textarea.focus();
}

export function addTextToEditor(text, moveCursorToMiddle) {
  const selectionStart = $("#editor")[0].selectionStart;
  const value = $("#editor").val();
  const newText =
    value.substring(0, selectionStart) + text + value.substring(selectionStart);
  $("#editor").val(newText);
  const newPos =
    selectionStart + (moveCursorToMiddle ? text.length / 2 : text.length);
  const textarea = $("#editor")[0];
  textarea.setSelectionRange(newPos, newPos);
  textarea.focus();
}

export function getEditorContent() {
  return $("#editor").val();
}
