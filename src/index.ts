import { message, copy } from './scripts/util.js'
import { parse } from './scripts/contain.js'

// 绑定复制事件
document.getElementById("copy")?.addEventListener('click', () => {
  const iframe = document.getElementById('theFrame') as HTMLIFrameElement;
  let editDom = document.getElementById("edit") as HTMLTextAreaElement
  let content = editDom?.value
  iframe?.contentWindow?.postMessage({ content }, '*');
})

// 监听沙盒消息回传
window.addEventListener('message', function ({ data }) {
  try {
    let psrseContent = parse(data)
    if (!data) return message.error("请输入正确的 JSON 格式");
    copy(psrseContent as string, () => message.success("复制成功"))
  } catch (error) {
    message.error("请输入正确的 JSON 格式")
  }
});





