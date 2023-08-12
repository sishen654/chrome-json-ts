import { getJson, parse, tsJsonToStr } from "@src/scripts/contain"

const getArrayType = (content: any[]) => {
  if (content.length === 1) return `${content}[]`
  return `(${content.join(" | ")})[]`
}

describe("parse base type", () => {
  it("parse base type which one", () => {
    expect(parse(getJson("{ a: 1 }"))).toEqual(tsJsonToStr({ a: "number" }))
    expect(parse(getJson("{ a: '1' }"))).toEqual(tsJsonToStr({ a: "string" }))
    expect(parse(getJson("{ a: true }"))).toEqual(tsJsonToStr({ a: "boolean" }))
    expect(parse(getJson("{ a: Symbol('a') }"))).toEqual(tsJsonToStr({ a: "symbol" }))
    expect(parse(getJson("{ a: undefined }"))).toEqual(tsJsonToStr({ a: "undefined" }))
    expect(parse(getJson("{ a:  null }"))).toEqual(tsJsonToStr({ a: "null" }))
  })
  it("parse base type whitch more than two", () => {
    expect(parse(getJson("{ a:  1, b: '1'}"))).toEqual(tsJsonToStr({ a: "number", b: "string" }))
    expect(parse(getJson("{a:1,b:2}"))).toEqual(tsJsonToStr({ a: "number", b: "number" }))
    expect(parse(getJson("{ a:  null, b: true }"))).toEqual(tsJsonToStr({ a: "null", b: "boolean" }))
    expect(parse(getJson("{ a:  undefined, b: Symbol('a') }"))).toEqual(tsJsonToStr({ a: "undefined", b: "symbol" }))
  })
})

describe("parse quote type which array", () => {
  it("parse array which one base type", () => {
    expect(parse(getJson("{ a: [1, 2, 3] }"))).toEqual(tsJsonToStr({ a: "number[]" }))
    expect(parse(getJson("{ a: ['1', '2', '3'] }"))).toEqual(tsJsonToStr({ a: "string[]" }))
    expect(parse(getJson("{ a: [true] }"))).toEqual(tsJsonToStr({ a: "boolean[]" }))
    expect(parse(getJson("{ a: [Symbol('a')] }"))).toEqual(tsJsonToStr({ a: "symbol[]" }))
    expect(parse(getJson("{ a: [undefined] }"))).toEqual(tsJsonToStr({ a: "undefined[]" }))
    expect(parse(getJson("{ a:  [null] }"))).toEqual(tsJsonToStr({ a: "null[]" }))
  })
  it("parse array whitch more than two base type", () => {
    expect(parse(getJson("{ a: [1, '1'] }"))).toEqual(tsJsonToStr({ a: "(number | string)[]" }))
    expect(parse(getJson("{ a: ['1', true, undefined] }"))).toEqual(tsJsonToStr({ a: "(string | boolean | undefined)[]" }))
    expect(parse(getJson("{ a: [null, 123, 'abc'] }"))).toEqual(tsJsonToStr({ a: "(null | number | string)[]" }))
  })
  it("parse array which quote type", () => {
    expect(parse(getJson("{ a: [{ name: 'sishen', age: 18 }] }"))).toEqual
      (tsJsonToStr({
        a: `${tsJsonToStr({
          name: "string",
          age: "number"
        })}[]`
      }))
    expect(parse(getJson("{ a: [{ name: 'sishen', age: 18 }, 1] }"))).toEqual
      (tsJsonToStr({
        a: `(${tsJsonToStr({
          name: "string",
          age: "number"
        })} | number)[]`
      }))
    expect(parse(getJson("{ obj: [{ name: 'sishen', age: 18 }, { a: 'sishen', b: 18 }] }"))).toEqual(
      tsJsonToStr({
        obj: getArrayType([
          tsJsonToStr({
            name: "string",
            age: "number"
          }),
          tsJsonToStr({
            a: "string",
            b: "number"
          })
        ])
      })
    )
    expect(parse(getJson("{ obj: [{ name: 'sishen', age: 18 }, [{ a: 1 }]] }"))).toEqual(
      tsJsonToStr({
        obj: getArrayType([
          tsJsonToStr({
            name: "string",
            age: "number"
          }),
          getArrayType([tsJsonToStr({
            a: "number",
          })])
        ])
      })
    )
    expect(parse(getJson("{ obj: [1, {a: ['2', [{ c: [3] }] ] } ] }"))).toEqual(
      tsJsonToStr({
        obj: getArrayType([
          "number",   // 1
          tsJsonToStr({
            a: getArrayType([
              "string",   // 2
              getArrayType([
                tsJsonToStr({
                  c: getArrayType(["number"])
                })
              ])
            ]),
          }),
        ])
      })
    )
  })
})

