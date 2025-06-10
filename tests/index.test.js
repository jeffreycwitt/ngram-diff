const {getIndexMatchArray, getIndexDiff, getTextArray, getHtmlArray, getHtmlDiff, testFunction, getNGramArrayArray, textClean, getReverseNGramMap} = require('../index.js');

it('the test function return the parameter', () => {
  const result = testFunction("test")
  expect(result).toBe("test")
});

it('get html diff return.base and check that it is an html string', () => {
  const result = getHtmlDiff("once upon a time, the brown fox when TO THE Store", "once UPon a time, a bear when to the store and ate cheese").base
  expect(typeof result).toBe("string")
});
it('get html diff return.compare and check that it is an html string', () => {
  const result = getHtmlDiff("once upon a time, the brown fox when TO THE Store", "once UPon a time, a bear when to the store and ate cheese").compare
  expect(typeof result).toBe("string")
});
it('get text array return an array ', () => {
  const result = getTextArray("once upon a time, the brown fox when TO THE Store")
  expect(Array.isArray(result)).toBe(true)
});
it('get getReverseNGramMap and get object ', () => {
  const result = getReverseNGramMap(getTextArray("once upon a time, the brown fox when TO THE Store"))
  expect(typeof result).toBe("object")
});
it('get getNGramArrayArray and get array ', () => {
  const result = getNGramArrayArray(getTextArray("once upon a time, the brown fox when TO THE Store"))
  expect(Array.isArray(result)).toBe(true)
});
it('get getHtmlArray and get an Array back ', () => {
  const result = getHtmlArray(getNGramArrayArray(getTextArray("once upon a time, the brown fox when TO THE Store")), getReverseNGramMap(getTextArray("once UPon a time, a bear when to the store and ate cheese")), getTextArray("once upon a time, the brown fox when TO THE Store"), "base")
  expect(Array.isArray(result)).toBe(true)
});
it('get getIndexMatchArray and get an Array back ', () => {
  const result = getIndexMatchArray(getNGramArrayArray(getTextArray("once upon a time, the brown fox when TO THE Store")), getReverseNGramMap(getTextArray("once UPon a time, a bear when to the store and ate cheese")), getTextArray("once upon a time, the brown fox when TO THE Store"), "base")
  console.log(result)
  expect(Array.isArray(result)).toBe(true)
});
it('get index match diff return.compare and check that it is an html string', () => {
  const result = getIndexDiff("once upon a time, the brown fox when TO THE Store", "once UPon a time, a bear when to the store and ate cheese").compare
  expect(typeof result).toBe("object")
});
it('run text clean', () => {
  const result = textClean("once upon a timae, the brown fox went TO THE Store & jumped & ate a fox")
  const expectedResult = "once upon a time the brown fox went to the store et iumped et ate a fox"
  expect(result).toEqual(expectedResult)
});
