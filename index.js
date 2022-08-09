const testFunction = (test) => {
  return test
}

const getHtmlDiff = (base, compare) => {

  const baseText = textClean(base)
  const compareText = textClean(compare)
  const baseTextArray = getTextArray(baseText)
  const compareTextArray = getTextArray(compareText)
  const baseNGramArrayArray = getNGramArrayArray(baseTextArray) // array with an index for each word [0,1,2...] in base text and each index has an array of ngrams it is a part of
  const baseNGramMap = getReverseNGramMap(baseTextArray) // a map where key is the ngram and value is array of the index positions that are included in the given array
  const compareNGramArrayArray = getNGramArrayArray(compareTextArray) // array with an index per word in compare text and each index has an array of ngrams it is a part of
  const compareNGramMap = getReverseNGramMap(compareTextArray) // a map where key is the ngram and value is array of the index positions that are included in the given array
  
  return {
    base: getHtmlArray(baseNGramArrayArray, compareNGramMap, baseTextArray, "base").join(" "),
    compare: getHtmlArray(compareNGramArrayArray, baseNGramMap, compareTextArray, "compare").join(" "),
  }
}


const getHtmlArray = (nGramArrayArray, opposingMap, textArray, baseOrCompare) => {
  const htmlArray = nGramArrayArray.map((ngramsForWord, i) => {
    matchingWords = []
    //loop through each of the ngrams for a given word
    ngramsForWord.forEach((ngram) => {
      // find "intersection" by checking to see if compareNGramMap contains this ngram. if it does add index of the word that is a part of the given ngram
      if (opposingMap[ngram]){
        matchingWords.push(i)
      }
    })
    const match = matchingWords.includes(i) ? " match" : ""
    return "<seg class='" + baseOrCompare + match + "' id='" + baseOrCompare + "-" + i + "' data-target='" + baseOrCompare + "' data-index='" + i + "'>" + textArray[i] + "</seg>"
  })
  return htmlArray
}
const getTextArray = (text) => {
  const firstTextArray = text.split(" ")
  var textArray = firstTextArray.filter(Boolean);
  return textArray

}

const getNGramArrayArray = (textArray) => {
  const nGramSize = 4
  const textLength = textArray.length
  const nGramArrayArray = []
  for (i=0; i<textLength; i++){
    const nGramArray = []
    for (n=0; n<nGramSize; n++){
      if (i-n >= 0){
      const nGramSlice = textArray.slice(i-n, (i-n)+nGramSize).join("")
      nGramArray.push(nGramSlice)
      }
    }
    nGramArrayArray.push(nGramArray)
  }
  return nGramArrayArray
}

const getReverseNGramMap = (textArray) => {
  const nGramSize = 4
  const textLength = textArray.length
  const nGramMap = {}
  for (i=0; i<textLength; i++){
    const nGramArray = []
    for (n=0; n<nGramSize; n++){
      if (i-n >= 0){
      const nGramSlice = textArray.slice(i-n, (i-n)+nGramSize).join("")
      nGramArray.push(nGramSlice)
      }
    }
    nGramArray.forEach((ngram) => {
        if (nGramMap[ngram]){
          nGramMap[ngram] = [...nGramMap[ngram], i]
        }
        else{
          nGramMap[ngram] = [i]
        }
      })
  }
  return nGramMap
}

const textClean = (text) => {
    // lowercase
    let punctuationless = text.toLowerCase()
    // remove most punctuation
    punctuationless = punctuationless.replace(/[.,/#!$%^&*;:{}=\-_`~()/\u00B6/|/\u204B/]/g,"");
    //convert v->u, ae->e, oe-e>
    punctuationless = punctuationless.replace(/v/g, "u");
    punctuationless = punctuationless.replace(/ae/g, "e");
    punctuationless = punctuationless.replace(/oe/g, "e");
    punctuationless = punctuationless.replace(/oe/g, "e");
    punctuationless = punctuationless.replace(/y/g, "i");
    //remove space
    punctuationless = punctuationless.replace(/\s{2,}/g," ");
    
    const finalFinalString = punctuationless
    return finalFinalString
}

module.exports = {getTextArray, getHtmlArray, getHtmlDiff, testFunction, getNGramArrayArray, textClean, getReverseNGramMap}