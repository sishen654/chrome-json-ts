import { message, copy } from './scripts/util.js'
import { parse } from './scripts/contain.js'

// 绑定复制事件
document.getElementById("copy")?.addEventListener('click', () => {
  let editDom = document.getElementById("edit") as HTMLTextAreaElement
  let content = editDom?.value
  try {
    let inputJson = new Function(`return ${content}`)()
    let psrseContent = parse(inputJson)
    copy(psrseContent, () => message.success("复制成功"))
  } catch (error) {
    message.error("请输入正确的 JSON 格式")
  }
})







