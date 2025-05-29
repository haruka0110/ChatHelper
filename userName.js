export const DEFATULT_USER_NAME = "請設定名字";
export let userName = DEFATULT_USER_NAME;
export const STORAGE_KEY_USER_NAME = "chat-editor-user-name";
export function loadUserName() {
  const savedName = localStorage.getItem(STORAGE_KEY_USER_NAME);
  userName = savedName ?? DEFATULT_USER_NAME;
  $("#setNameText").text(userName);
}
export function setUserName(name) {
  if (name && name.trim() !== "") {
    userName = name.trim();
    localStorage.setItem(STORAGE_KEY_USER_NAME, userName);
    $("#setNameText").text(name.trim() ?? DEFATULT_USER_NAME);
    return true;
  } else {
    return false;
  }
}
