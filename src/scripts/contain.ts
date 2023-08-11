export const parse = (content: any) => {
  parseType(content)
  let currentRow = 0
  return JSON.stringify(content, null, 4)
    .replace(/"/g, '')
    .replace(/\\n(\s*)/g, ($1, $2) => {
      if ($2.length === 0) {
        return `\n${" ".repeat(currentRow * 1)}`
      } else {
        currentRow = $2.length
      }
      return `\n${" ".repeat($2.length * 2)}`
    })
}

export function parseType(val: any) {
  let type = typeof val
  switch (type) {
    case "function":
      return parseFunction(val)
    case "object":
      return parseQuoteType(val)
    default:
      return type
  }
}

// 解析引用类型
export function parseQuoteType(quoteVal: any) {
  // 数组
  if (Array.isArray(quoteVal)) {
    return parseArr(quoteVal)
  }
  // null
  else if (Object.prototype.toString.call(quoteVal) === '[object Null]') {
    return "null"
  }
  // 对象
  else if (Object.prototype.toString.call(quoteVal) === '[object Object]') {
    return parseObject(quoteVal)
  }
}

// 解析数组
export function parseArr(arr: any[]) {
  let val = arr[0]
  return parse(val) + '[]'
}

// 解析函数
export function parseFunction(fn: Function) {
  return fn.toString()
}

// 解析对象
export function parseObject(obj: Record<string, any>) {
  Object.keys(obj).forEach(key => {
    obj[key] = parseType(obj[key])
  })
  return obj
}
