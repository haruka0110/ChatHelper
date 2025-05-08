const getEditorActionHandler = (f) => {
  return (e) => {
    f(e);
    $("#editor-action-dropdown").removeAttr("open");
  };
};

$("#copy").on(
  "click",
  getEditorActionHandler(() => {
    const text = $("#editor").val();

    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("已複製到剪貼簿！");
      })
      .catch((err) => {
        showToast("複製失敗：" + err);
      });
  })
);

function showToast(message) {
  const toast = $("#toast");
  toast.text(message);
  toast.removeClass("hidden").addClass("show");

  setTimeout(() => {
    toast.removeClass("show").addClass("hidden");
  }, 2000); // 顯示 2 秒
}

const STORAGE_KEY = "chat-editor-content";

// 儲存內容到 localStorage
$("#save").on(
  "click",
  getEditorActionHandler(() => {
    const content = $("#editor").val();
    localStorage.setItem(STORAGE_KEY, content);
    showToast("已暫存內容");
    showSaveIndicator();
  })
);

function autoSave() {
  const content = $("#editor").val();
  localStorage.setItem(STORAGE_KEY, content);
  showSaveIndicator();
}

function showSaveIndicator() {
  const el = $("#save-indicator");
  el.addClass("active");
  setTimeout(() => el.removeClass("active"), 1000); // 閃 1 秒
}

// 每 10 秒自動儲存
setInterval(autoSave, 10000); // 10000 ms = 10 秒

// 從 localStorage 載入內容
$("#load").on(
  "click",
  getEditorActionHandler(() => {
    const content = localStorage.getItem(STORAGE_KEY);
    if (content !== null) {
      $("#editor").val(content);
      showToast("已載入暫存內容");
    } else {
      showToast("沒有可載入的內容");
    }
  })
);

// 清除編輯器的內容
$("#clear").on(
  "click",
  getEditorActionHandler(() => {
    $("#editor").val("");
    localStorage.removeItem(STORAGE_KEY);
    showToast("已清除內容");
  })
);

function moveCursor(offset) {
  const textarea = $("#editor")[0];
  const pos = textarea.selectionStart;
  const newPos = Math.max(0, Math.min(pos + offset, textarea.value.length));
  textarea.setSelectionRange(newPos, newPos);
  textarea.focus();
}

/// 延遲啟動連續移動（長按）
function attachCursorControl(buttonId, offset) {
  let intervalId = null;
  let holdTimeout = null;

  const $button = $(buttonId);
  const button = $button[0];

  const start = () => {
    moveCursor(offset); // 點一下就移動

    holdTimeout = setTimeout(() => {
      // 加上 .holding 樣式
      $button.addClass("holding");

      intervalId = setInterval(() => moveCursor(offset), 100);
    }, 800); // 長按 0.8 秒進入持續模式
  };

  const stop = () => {
    clearTimeout(holdTimeout);
    clearInterval(intervalId);
    $button.removeClass("holding");
  };

  // 滑鼠事件
  button.addEventListener("mousedown", start);
  button.addEventListener("mouseup", stop);
  button.addEventListener("mouseleave", stop);

  // 手機觸控事件
  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    start();
  });
  button.addEventListener("touchend", stop);
  button.addEventListener("touchcancel", stop);
}

attachCursorControl("#cursor-left", -1);
attachCursorControl("#cursor-right", 1);

const addTextToEditor = (text, moveCursorToMiddle) => {
  const newText = $("#editor").val() + text;
  $("#editor").val(newText);
  const newPos = newText.length - (moveCursorToMiddle ? text.length / 2 : 0);
  const textarea = $("#editor")[0];
  textarea.setSelectionRange(newPos, newPos);
  textarea.focus();
};

$("#addAction").on("click", () => {
  addTextToEditor("::::", true);
});

$("#addActionStar").on("click", () => {
  addTextToEditor("*()*", true);
});

$("#addQuotation").on("click", () => {
  addTextToEditor("「」", true);
});

$("#addNameTag").on("click", () => {
  const nameTag = $("#addNameTag").text();
  addTextToEditor(nameTag);
});

const NAME_KEY = "chat-helper-name";
let userName = "";

// 初始化按鈕文字
function loadName() {
  userName = localStorage.getItem(NAME_KEY);
  $("#setName").text(userName ? `👤 ${userName}` : "點此輸入名字");
  $("#addNameTag").text(`【${userName ?? ""}】`);
}

// 點擊後彈出 prompt 設定名字
$("#setName").on("click", () => {
  const currentName = localStorage.getItem(NAME_KEY) || "";
  const newName = prompt("請輸入你的名字：", currentName);

  if (newName !== null && newName.trim() !== "") {
    localStorage.setItem(NAME_KEY, newName.trim());
    $("#setName").text(`👤 ${newName.trim()}`);
    showToast("已設定名字");
  }
});

// 初次載入時執行
$(document).ready(loadName);
