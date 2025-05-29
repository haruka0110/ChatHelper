// 通用工具
export function showToast(message) {
  const toast = $("#toast");
  toast.text(message);
  toast.removeClass("hidden").addClass("show");

  if (window.toastTimer) {
    clearTimeout(window.toastTimer);
  }
  window.toastTimer = setTimeout(() => {
    toast.removeClass("show").addClass("hidden");
  }, 2000);
}

export function setRealViewportHeight() {
  document.documentElement.style.setProperty(
    "--full-height",
    `${window.visualViewport.height}px`
  );
}

export function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

export function loadFromLocalStorage(key) {
  return localStorage.getItem(key);
}

export function getEditorActionHandler(fn) {
  return (e) => {
    fn(e);
    $("#editorActionDropdown").removeAttr("open");
  };
}

export function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("已複製到剪貼簿");
    })
    .catch((err) => {
      console.error("複製失敗:", err);
      showToast("複製失敗");
    });
}

/// 延遲啟動連續移動（長按）
export function attachHoldAction(buttonId, action, options = {}) {
  const holdDelay = options.holdDelay ?? 800;
  const repeatInterval = options.repeatInterval ?? 100;
  const holdingClass = options.holdingClass ?? "holding";
  const onClick = options.onClick;
  const onRelease = options.onRelease;

  let intervalId = null;
  let holdTimeout = null;
  let isHolding = false;

  const $button = $(buttonId);
  const button = $button[0];

  const start = () => {
    isHolding = false;
    holdTimeout = setTimeout(() => {
      $button.addClass(holdingClass);
      isHolding = true;
      intervalId = setInterval(action, repeatInterval);
    }, holdDelay);

    action(); // 點一下就執行一次
  };

  const stop = () => {
    clearTimeout(holdTimeout);
    clearInterval(intervalId);
    $button.removeClass(holdingClass);

    // 僅點一下（未進入長按）時呼叫 onClick
    if (!isHolding && typeof onClick === "function") {
      onClick();
    }
    // 無論長按與否，結束時呼叫 onRelease
    if (typeof onRelease === "function") {
      onRelease(isHolding);
    }
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
