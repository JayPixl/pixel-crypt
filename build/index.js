"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpixelate = exports.pixelate = void 0;
const debug = false;
const alphaMap = [...("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""))];
const operations = {
    0: (str, direction, seed) => {
        debug && console.log(`CALL 0 ${direction} ${seed}`);
        return str.split("").reverse().join("");
    },
    1: (str, direction, seed) => {
        debug && console.log(`CALL 1 ${direction} ${seed}`);
        return (chunkify(str, seed % str.length).map(chunk => {
            if (chunk.length === seed % str.length) {
                return chunk.split("").reverse().join("");
            }
            else {
                return chunk;
            }
        })).join("");
    },
    2: (str, direction, seed) => {
        debug && console.log(`CALL 2 ${direction} ${seed}`);
        return swapChar(str, 0, seed % str.length);
    },
};
const chunkify = (str, size) => {
    const chunks = [];
    for (let i = 0; i < str.length; i += size) {
        chunks.push(str.slice(i, i + size));
    }
    return chunks;
};
const swapChar = (str, fromIndex, toIndex) => {
    const arr = str.split("");
    const temp = arr[fromIndex];
    arr[fromIndex] = arr[toIndex];
    arr[toIndex] = temp;
    return arr.join("");
};
const stringToLongNumber = (inputString) => {
    let longNumber = '';
    [...inputString].map(i => {
        let codePoint = i.codePointAt(0)?.toString() || '';
        while (codePoint.length < 6) {
            codePoint = "0" + codePoint;
        }
        longNumber += codePoint;
    });
    return longNumber;
};
const longNumberToString = (longNumber) => {
    let stringResult = '';
    let currentCodePoint = '';
    for (let i = 0; i < longNumber.length; i++) {
        currentCodePoint += longNumber[i];
        if (i % 6 === 5 || i === longNumber.length - 1) {
            stringResult += String.fromCodePoint(parseInt(currentCodePoint));
            currentCodePoint = '';
        }
    }
    return stringResult;
};
const formatSeed = (seed) => {
    if (/[^a-zA-Z0-9]+/.test(seed))
        return {
            error: "Seed can only contain alphanumeric characters!"
        };
    if (seed.length < 5)
        return {
            error: "Seed must be at least 5 characters long!"
        };
    if (seed.length > 30)
        return {
            error: "Seed cannot be more than 30 characters long!"
        };
    let formattedSeed = seed;
    let iteration = 0;
    while (formattedSeed.length < 50) {
        if (iteration % 2 === 0) {
            formattedSeed += modifyCharBySeed(formattedSeed[iteration], formattedSeed[iteration + 1], 1);
            iteration++;
        }
        else {
            formattedSeed += modifyCharBySeed(formattedSeed[iteration], formattedSeed[iteration + 1], -1);
            iteration++;
        }
    }
    let slicedArray = formattedSeed.slice(25).split("");
    let formattedSeedArray = formattedSeed.substring(0, 25).split("");
    iteration = 0;
    slicedArray.map(char => {
        formattedSeedArray[iteration] = modifyCharBySeed(formattedSeed[iteration], char) || "";
        iteration++;
    });
    formattedSeed = formattedSeedArray.join("");
    return {
        formattedSeed
    };
};
const modifyCharBySeed = (char, seed, modifier = 1) => {
    let addedIndex = alphaMap?.indexOf(char) + (alphaMap?.indexOf(seed) * modifier);
    if (addedIndex >= alphaMap.length) {
        addedIndex -= alphaMap.length;
    }
    if (addedIndex < 0) {
        addedIndex += alphaMap.length;
    }
    const newChar = alphaMap?.[addedIndex];
    if (newChar) {
        return newChar;
    }
    else {
        return null;
    }
};
const compactZeroes = (number) => {
    debug && console.log(`STARTING COMPACT: ${number}`);
    let zeroCount = 0;
    let lastNum = "";
    return ([...number].map((char, index) => {
        if (char === "0" && index === number.length - 1) {
            let chunk = zeroCount + 1 < 10 ? ("0" + (zeroCount + 1)) : ("00" + (zeroCount + 1));
            return chunk;
        }
        if (char === "0") {
            zeroCount++;
            lastNum = char;
            return "";
        }
        else {
            if (lastNum === "0") {
                let chunk = zeroCount < 10 ? ("0" + zeroCount + char) : ("00" + zeroCount + char);
                zeroCount = 0;
                lastNum = char;
                return chunk;
            }
            else {
                lastNum = char;
                return char;
            }
        }
    })).join("");
};
const decompactZeroes = (number) => {
    debug && console.log(`STARTING DECOMPACT: ${number}`);
    let newArr = [];
    for (let i = 0; i < number.length; i++) {
        if (number[i] === "0" && number?.[i - 2] + number?.[i - 3] !== "00" && number[i - 1] !== "0") {
            let chunk = "";
            let times = number[i + 1] === "0" ? Number(number[i + 2] + number[i + 3]) : Number(number[i + 1]);
            for (var ii = 0; ii < times; ii++) {
                chunk += "0";
            }
            newArr.push(chunk);
        }
        else {
            if ((number?.[i - 1] !== "0" && number?.[i - 2] + number?.[i - 3] !== "00") || (number?.[i - 1] === "0" && number?.[i - 3] + number?.[i - 4] === "00")) {
                newArr.push(number[i]);
            }
        }
    }
    return newArr.join("");
};
const compressPixel = (pixel) => {
    const compressedPixel = compactZeroes(pixel);
    debug && console.log(`COMPRESSED PIXEL: ${compressedPixel}`);
    const pixelChunks = chunkify(compressedPixel, 12);
    return pixelChunks.map(chunk => chunk[0] === "0" ? "y" + Number(chunk).toString(34) : Number(chunk).toString(34)).join("z");
};
const decrompressPixel = (pixel) => {
    return decompactZeroes(pixel.split("z").map(chunk => chunk[0] === "y" ? "0" + parseInt(chunk.slice(1), 34).toString() : parseInt(chunk, 34).toString()).join(""));
};
const pixelate = (string, seed) => {
    if (string.length < 5)
        return {
            error: "String must be at least 5 characters long!"
        };
    const number = stringToLongNumber(string);
    const { formattedSeed, error } = formatSeed(seed);
    if (error || !formattedSeed)
        return {
            error
        };
    let workingString = number;
    [...formattedSeed].map(char => {
        workingString = (operations?.[(alphaMap.indexOf(char) % Object.values(operations).length)])(workingString, "F", alphaMap.indexOf(char));
    });
    debug && console.log(`BEFORE COMPACT: ${workingString}`);
    return {
        pixel: compressPixel(workingString)
    };
};
exports.pixelate = pixelate;
const unpixelate = (pixel, seed) => {
    const { formattedSeed, error } = formatSeed(seed);
    if (error || !formattedSeed)
        return {
            error
        };
    let workingString = decrompressPixel(pixel);
    debug && console.log(`AFTER COMPACT: ${workingString}`);
    [...formattedSeed].reverse().map(char => {
        workingString = (operations?.[(alphaMap.indexOf(char) % Object.values(operations).length)])(workingString, "B", alphaMap.indexOf(char));
    });
    let string = longNumberToString(workingString);
    return {
        result: string
    };
};
exports.unpixelate = unpixelate;
exports.default = module;
//# sourceMappingURL=index.js.map