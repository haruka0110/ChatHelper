export function setCountingCheckButton(isCounting) {
  if (isCounting)
    $("#toggleCounting").addClass("checked").removeClass("outline secondary");
  else
    $("#toggleCounting").removeClass("checked").addClass("outline secondary");
}

export function setCharacterLabelCheckButton(isCharacterLabel) {
  if (isCharacterLabel)
    $("#toggleCharacterLabel")
      .addClass("checked")
      .removeClass("outline secondary");
  else
    $("#toggleCharacterLabel")
      .removeClass("checked")
      .addClass("outline secondary");
}
