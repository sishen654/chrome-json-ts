import { parse } from "@src/scripts/contain"

describe("parse normal", () => {
  it("parse base type", () => {
    expect(parse("{ a: 1 }")).toEqual("{ a: number }")
  })
})
