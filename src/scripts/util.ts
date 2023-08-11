export type Options = { delay?: number, mount?: HTMLElement }

// 1) tip
export const message = {
  success: (msg: string, option: Options = {}) => message.create(msg, 'success', option),
  error: (msg: string, option: Options = {}) => message.create(msg, 'error', option),
  warn: (msg: string, option: Options = {}) => message.create(msg, 'warn', option),
  create(msg: string, type: string, option: Options = {}) {
    let { delay, mount } = option
    let div = document.createElement('div')
    let body = document.body
    div.innerText = msg
    div.className = `message ${type}`
    mount ? mount.appendChild(div) : body.appendChild(div)
    // 清除 dom
    if (delay) {
      return setTimeout(() => mount ? mount.removeChild(div) : body.removeChild(div), delay);
    }
    setTimeout(() => mount ? mount.removeChild(div) : body.removeChild(div), 1000);
  }
}

// 2) browser
export const copy = (content: string, success?: () => void, error?: (err: Error) => void) => {
  // 检查浏览器是否支持Clipboard API
  if (navigator.clipboard) {
    // 使用Clipboard API复制文本
    navigator.clipboard.writeText(content)
      .then(() => success && success())
      .catch(err => error && error(err));
  } else {
    console.error("浏览器不支持Clipboard API");
  }
}
