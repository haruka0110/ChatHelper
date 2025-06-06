export function setCharacterLabel(setting, counter, userName) {
  if (!setting.isCounting && !setting.isCharacterLabel) {
    $("#characterLabel").text("").addClass("hidden");
    $("#editor").addClass("top-rounded").removeClass("top-not-rounded");
    return;
  } else {
    $("#characterLabel").removeClass("hidden");
    $("#editor").removeClass("top-rounded").addClass("top-not-rounded");
  }
  const counterText = setting.isCounting ? `[${counter}]` : "";
  const nameText = setting.isCharacterLabel
    ? `【${userName ?? "請設定名字"}】`
    : "";
  $("#characterLabel").text(counterText + nameText);
}

export function getCharacterLabel() {
  const text = $("#characterLabel").text();
  return text ? text + "\n\n" : "";
}
