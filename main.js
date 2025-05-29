// 主初始化與事件註冊
import {
  showToast,
  setRealViewportHeight,
  getEditorActionHandler,
  attachHoldAction,
  copyToClipboard,
} from "./utils.js";
import {
  counter,
  increaseCounter,
  decreaseCounter,
  setCounter,
  loadCounter,
  saveCounter,
} from "./counter.js";
import {
  loadEditorContent,
  clearEditorContent,
  moveCursor,
  moveCursorLine,
  addTextToEditor,
  saveEditorContent,
} from "./editor.js";
import { setting, saveSetting, loadSetting } from "./settings.js";
import { getCharacterLabel, setCharacterLabel } from "./characterLabel.js";
import { setUserName, userName, loadUserName } from "./userName.js";
import {
  setCharacterLabelCheckButton,
  setCountingCheckButton,
} from "./settingButton.js";

// 使用工具函式重構
function attachCursorControl(buttonId, offset) {
  attachHoldAction(buttonId, () => moveCursor(offset), {
    holdDelay: 800,
    repeatInterval: 100,
    holdingClass: "holding",
  });
}

const setCounterActions = (isCounting) => {
  if (isCounting) $("#counterActions").removeClass("hidden");
  else $("#counterActions").addClass("hidden");
};

let isContentChanged = false;

$(document).ready(() => {
  // 初始化與事件註冊
  loadSetting();
  loadUserName();
  loadCounter();
  setCounterActions(setting.isCounting);
  setCountingCheckButton(setting.isCounting);
  setCharacterLabelCheckButton(setting.isCharacterLabel);
  setCharacterLabel(setting, counter, userName);

  // ... 其他初始化 ...
  setRealViewportHeight();
  visualViewport.addEventListener("resize", setRealViewportHeight);
  document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );

  // 依需求註冊事件
  $("#copy").on(
    "click",
    getEditorActionHandler(() => {
      copyToClipboard(getCharacterLabel() + "\n\n" + getEditorContent());
    })
  );

  // 儲存內容到 localStorage
  $("#save").on(
    "click",
    getEditorActionHandler(() => {
      saveEditorContent();
      showToast("已暫存內容");
    })
  );

  // 從 localStorage 載入內容
  $("#load").on("click", getEditorActionHandler(loadEditorContent));

  // 清除編輯器的內容
  $("#clear").on(
    "click",
    getEditorActionHandler(() => {
      clearEditorContent();
      showToast("已清除內容");
    })
  );

  // 設定計數器
  $("#setCounter").on(
    "click",
    getEditorActionHandler(() => {
      const newCounter = prompt("請輸入計數值：", counter);
      const parsedCounter = parseInt(newCounter, 10);
      if (
        !isNaN(parsedCounter) &&
        parsedCounter >= 0 &&
        parsedCounter <= 9999
      ) {
        setCounter(parsedCounter);
        setCharacterLabel(setting, parsedCounter, userName);
        showToast("計數已更新");
      } else {
        showToast("請輸入有效的計數值（0-9999）");
      }
    })
  );

  // 左右移動游標
  attachCursorControl("#cursorLeft", -1);
  attachCursorControl("#cursorRight", 1);

  // 上下移動游標
  attachHoldAction(
    "#cursorUp",
    () => {
      moveCursorLine(-1);
    },
    {
      holdDelay: 800,
      repeatInterval: 100,
      holdingClass: "holding",
    }
  );
  attachHoldAction(
    "#cursorDown",
    () => {
      moveCursorLine(1);
    },
    {
      holdDelay: 800,
      repeatInterval: 100,
      holdingClass: "holding",
    }
  );

  // counter 操作
  const counterHoldOptioins = {
    holdDelay: 800,
    repeatInterval: 100,
    holdingClass: "holding",
    onClick: saveCounter,
    onRelease: saveCounter,
  };
  attachHoldAction(
    "#mobileCounterMinus",
    () => {
      decreaseCounter(false);
      setCharacterLabel(setting, counter, userName);
    },
    counterHoldOptioins
  );
  attachHoldAction(
    "#mobileCounterAdd",
    () => {
      increaseCounter(false);
      setCharacterLabel(setting, counter, userName);
    },
    counterHoldOptioins
  );
  attachHoldAction(
    "#desktopCounterMinus",
    () => {
      decreaseCounter(false);
      setCharacterLabel(setting, counter, userName);
    },
    counterHoldOptioins
  );
  attachHoldAction(
    "#desktopCounterAdd",
    () => {
      increaseCounter(false);
      setCharacterLabel(setting, counter, userName);
    },
    counterHoldOptioins
  );

  // 加入文字到編輯器
  $("#addAction").on("click", () => {
    addTextToEditor("::::", true);
  });

  // $("#addActionStar").on("click", () => {
  //   addTextToEditor("*()*", true);
  // });

  $("#addQuotation").on("click", () => {
    addTextToEditor("「」", true);
  });

  $("#addEllipsis").on("click", () => {
    addTextToEditor("⋯⋯", false);
  });

  // 設定是否要使用計數器
  $("#toggleCounting").on("click", () => {
    setting.isCounting = !setting.isCounting;
    setCountingCheckButton(setting.isCounting);
    setCounterActions(setting.isCounting);
    setCharacterLabel(setting, counter, userName);
    saveSetting();
    showToast(`計數功能已${setting.isCounting ? "開啟" : "關閉"}`);
  });

  // 設定是否加入角色名稱
  $("#toggleCharacterLabel").on("click", () => {
    setting.isCharacterLabel = !setting.isCharacterLabel;
    setCharacterLabelCheckButton(setting.isCharacterLabel);
    setCharacterLabel(setting, counter, userName);
    saveSetting();
    showToast(`角色標籤已${setting.isCharacterLabel ? "開啟" : "關閉"}`);
  });

  // 點擊後彈出 prompt 設定名字
  $("#setName").on("click", () => {
    const newName = prompt("請輸入你的名字：", userName ?? "")?.trim();
    const success = setUserName(newName);
    success && showToast("已設定名字");
  });

  $("#editor").on("input", () => {
    // 當編輯器內容變更時，紀錄已變更內容
    isContentChanged = true;
  });

  isContentChanged = false; // 初始化為未變更

  // 每 10 秒自動儲存
  setInterval(() => {
    if (!isContentChanged) return; // 如果內容沒有變更，則不儲存
    isContentChanged = false; // 重置變更狀態
    saveEditorContent();
  }, 10000); // 10000 ms = 10 秒

  // RWD: 根據 userAgent 切換 .mobile/.desktop 顯示
  function setDeviceVisibility() {
    const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(
      navigator.userAgent
    );
    document.querySelectorAll(".mobile").forEach((el) => {
      el.style.display = isMobile ? "block" : "none";
    });
    document.querySelectorAll(".desktop").forEach((el) => {
      el.style.display = isMobile ? "none" : "block";
    });
  }
  setDeviceVisibility();
  window.addEventListener("resize", setDeviceVisibility);
});
