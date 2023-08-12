import { message, copy } from './scripts/util.js'
import { parse } from './scripts/contain.js'

// 绑定复制事件
document.getElementById("copy")?.addEventListener('click', () => {
  let editDom = document.getElementById("edit") as HTMLTextAreaElement
  let content = editDom?.value
  console.log("content", content);

  try {
    let inputJson = new Function(`return 123`)
    // let psrseContent = parse(inputJson)
    console.log("inputJson", inputJson);
    // console.log("psrseContent", psrseContent);
    // copy(psrseContent as string, () => message.success("复制成功"))
  } catch (error) {
    console.log("error", error);

    message.error("请输入正确的 JSON 格式")
  }
})







