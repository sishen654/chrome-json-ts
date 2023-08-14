export const getJson = (json: string) => new Function(`return ${json}`)()
export type BaseType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined"
export const baseType = ["string", "number", "bigint", "boolean", "symbol", "undefined"]

export const parse = (content: Record<string, any>) => {
  // 1 解析类型, 修改数据
  parseType(content)
  // 2 解析对象，生成字符串格式
  return tsJsonToStr(content)
}

export const tsJsonToStr = (tsObj: Record<string, any>) => {
  if (Object.prototype.toString.call(tsObj) !== '[object Object]') return tsObj
  let currentRow = 0
  return JSON.stringify(tsObj, null, 4)
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
  let arrTypes = new Set<any>()
  arr.forEach(val => arrTypes.add(parseType(val)))
  let str = ""
  let types = [...arrTypes]
  let len = types.length
  if (len === 0) return `any[]`
  else if (len === 1) return `${tsJsonToStr(types[0])}[]`
  else {
    types.forEach((v, i) => {
      str += `${tsJsonToStr(v)}${i === len - 1 ? '' : ' '}${i === len - 1 ? '' : '| '}`
    })
  }
  return `(${str})[]`
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
