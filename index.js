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

const getIndexDiff = (base, compare) => {

  const baseText = textClean(base)
  const compareText = textClean(compare)
  const baseTextArray = getTextArray(baseText)
  const compareTextArray = getTextArray(compareText)
  const baseNGramArrayArray = getNGramArrayArray(baseTextArray) // array with an index for each word [0,1,2...] in base text and each index has an array of ngrams it is a part of
  const baseNGramMap = getReverseNGramMap(baseTextArray) // a map where key is the ngram and value is array of the index positions that are included in the given array
  const compareNGramArrayArray = getNGramArrayArray(compareTextArray) // array with an index per word in compare text and each index has an array of ngrams it is a part of
  const compareNGramMap = getReverseNGramMap(compareTextArray) // a map where key is the ngram and value is array of the index positions that are included in the given array
  
  return {
    base: getIndexMatchArray(baseNGramArrayArray, compareNGramMap),
    compare: getIndexMatchArray(compareNGramArrayArray, baseNGramMap)
  }
}

const getIndexMatchArray = (nGramArrayArray, opposingMap, textArray, baseOrCompare) => {
  
  const indexArray = nGramArrayArray.map((ngramsForWord, i) => {
    const matchingWords = []
    //loop through each of the ngrams for a given word
    ngramsForWord.forEach((ngram) => {
      // find "intersection" by checking to see if compareNGramMap contains this ngram. if it does add index of the word that is a part of the given ngram
      if (opposingMap[ngram]){
        matchingWords.push(i)
      }
    })
    const match = matchingWords.includes(i) ? true : false
    return match
  })
  return indexArray
 
}

const getHtmlArray = (nGramArrayArray, opposingMap, textArray, baseOrCompare) => {
  const htmlArray = nGramArrayArray.map((ngramsForWord, i) => {
    const matchingWords = []
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
  for (var i=0; i<textLength; i++){
    const nGramArray = []
    for (var n=0; n<nGramSize; n++){
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
  for (var i=0; i<textLength; i++){
    const nGramArray = []
    for (var n=0; n<nGramSize; n++){
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

// const textClean = (text) => {
//     // lowercase
//     let punctuationless = text.toLowerCase()
//     // remove most punctuation
//     punctuationless = punctuationless.replace(/[.,/#!$%^&*;:{}=\-_`~()/\u00B6/|/\u204B/]/g,"");
//     //convert v->u, ae->e, oe-e>
//     punctuationless = punctuationless.replace(/v/g, "u");
//     punctuationless = punctuationless.replace(/ae/g, "e");
//     punctuationless = punctuationless.replace(/oe/g, "e");
//     punctuationless = punctuationless.replace(/oe/g, "e");
//     punctuationless = punctuationless.replace(/y/g, "i");
//     //remove space
//     punctuationless = punctuationless.replace(/\s{2,}/g," ");
    
//     const finalFinalString = punctuationless
//     return finalFinalString
// }

const textClean = (text, replacements = true) => {

    //convert pilcrows to et
    let punctuationless = text.trim()

    punctuationless = text.replace(/&/g, "et");
    //convert remove punctuation
    const punctuationRegEx = /[!-/:-@[-`{-~¡-©«-¬®-±´¶-¸»¿×÷˂-˅˒-˟˥-˫˭˯-˿͵;΄-΅·϶҂՚-՟։-֊־׀׃׆׳-״؆-؏؛؞-؟٪-٭۔۩۽-۾܀-܍߶-߹।-॥॰৲-৳৺૱୰௳-௺౿ೱ-ೲ൹෴฿๏๚-๛༁-༗༚-༟༴༶༸༺-༽྅྾-࿅࿇-࿌࿎-࿔၊-၏႞-႟჻፠-፨᎐-᎙᙭-᙮᚛-᚜᛫-᛭᜵-᜶។-៖៘-៛᠀-᠊᥀᥄-᥅᧞-᧿᨞-᨟᭚-᭪᭴-᭼᰻-᰿᱾-᱿᾽᾿-῁῍-῏῝-῟῭-`´-῾\u2000-\u206e⁺-⁾₊-₎₠-₵℀-℁℃-℆℈-℉℔№-℘℞-℣℥℧℩℮℺-℻⅀-⅄⅊-⅍⅏←-⏧␀-␦⑀-⑊⒜-ⓩ─-⚝⚠-⚼⛀-⛃✁-✄✆-✉✌-✧✩-❋❍❏-❒❖❘-❞❡-❵➔➘-➯➱-➾⟀-⟊⟌⟐-⭌⭐-⭔⳥-⳪⳹-⳼⳾-⳿⸀-\u2e7e⺀-⺙⺛-⻳⼀-⿕⿰-⿻\u3000-〿゛-゜゠・㆐-㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉃㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꘍-꘏꙳꙾꜀-꜖꜠-꜡꞉-꞊꠨-꠫꡴-꡷꣎-꣏꤮-꤯꥟꩜-꩟﬩﴾-﴿﷼-﷽︐-︙︰-﹒﹔-﹦﹨-﹫！-／：-＠［-｀｛-･￠-￦￨-￮￼-�]|\ud800[\udd00-\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc\udf9f\udfd0]|\ud802[\udd1f\udd3f\ude50-\ude58]|\ud809[\udc00-\udc7e]|\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56]|\ud835[\udec1\udedb\udefb\udf15\udf35\udf4f\udf6f\udf89\udfa9\udfc3]|\ud83c[\udc00-\udc2b\udc30-\udc93]/g;
    punctuationless = punctuationless.replace(punctuationRegEx, '').replace(/(\s){2,}/g, '$1');
    //let punctuationless = text.replace(/[.,/#!$%^&*;:{}=\-_`~()/\u00B6/|/\u204B/]/g,"");
    
    // convert to lowercase
    punctuationless = punctuationless.toLowerCase()
    
    const replacementsSecund = {
      '1m': 'primum',
      '1um': 'primum',
      '1am': 'primam',
      '1ae': 'primae',
      '1a': 'prima',
      '1o': 'primo',
      '1us': 'primus',
      '2m': 'secundum',
      '2um': 'secundum',
      '2am': 'secundam',
      '2ae': 'secunde',
      '2a': 'secunda',
      '2o': 'secundo',
      '2us': 'secundus',
      '3m': 'tertium',
      '3um': 'tertium',
      '3am': 'tertiam',
      '3ae': 'tertiae',
      '3a': 'tertia',
      '3o': 'tertio',
      '3us': 'tertius',
      '4m': 'quartum',
      '4um': 'quartum',
      '4am': 'quartam',
      '4ae': 'quartae',
      '4a': 'quarta',
      '4or': 'quattuor',
      '4o': 'quarto',
      '4us': 'quartus',
      '5m': 'quintum',
      '5um': 'quintum',
      '5am': 'quintam',
      '5ae': 'quintae',
      '5a': 'quinta',
      '5o': 'quinto',
      '5us': 'quintus',
      '6m': 'sextum',
      '6um': 'sextum',
      '6am': 'sextam',
      '6ae': 'sextae',
      '6a': 'sexta',
      '6o': 'sexto',
      '6us': 'sextus',
      '7m': 'septimum',
      '7um': 'septimum',
      '7am': 'septimam',
      '7ae': 'septimae',
      '7a': 'septima',
      '7o': 'septimo',
      '7us': 'septimus',
      '8m': 'octavum',
      '8um': 'octavum',
      '8am': 'octavam',
      '8ae': 'octavae',
      '8a': 'octava',
      '8o': 'octavo',
      '8us': 'octavus',
      '9m': 'nonum',
      '9um': 'nonum',
      '9am': 'nonam',
      '9ae': 'nonae',
      '9a': 'nona',
      '9o': 'nono',
      '9us': 'nonus'
      

    };
    
    

    // Function to replace all occurrences based on the replacementsSecund object
    const replaceNumberTerms = (punctuationless) => {
      const regex = new RegExp(Object.keys(replacementsSecund).join('|'), 'g');
      return punctuationless.replace(regex, (match) => replacementsSecund[match]);
    }

    if (replacements){
      //convert v->u, ae->e, oe-e>
      
      punctuationless = replaceNumberTerms(punctuationless);
      punctuationless = punctuationless.replace(/v/g, "u");
      punctuationless = punctuationless.replace(/ae/g, "e");
      punctuationless = punctuationless.replace(/oe/g, "e");
      punctuationless = punctuationless.replace(/oe/g, "e");
      punctuationless = punctuationless.replace(/y/g, "i");
      punctuationless = punctuationless.replace(/j/g, "i");
      punctuationless = punctuationless.replace(/inm/g, "imm");
      punctuationless = punctuationless.replace(/sicud/g, "sicut");
      //remove space
      punctuationless = punctuationless.replace(/\s{2,}/g," ");
    }
    


    return punctuationless.toLowerCase()
  }

module.exports = {getIndexDiff, getIndexMatchArray, getTextArray, getHtmlArray, getHtmlDiff, testFunction, getNGramArrayArray, textClean, getReverseNGramMap}