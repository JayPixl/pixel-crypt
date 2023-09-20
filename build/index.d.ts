declare const debug = false;
declare const alphaMap: string[];
declare const operations: any;
declare const chunkify: (str: string, size: number) => string[];
declare const swapChar: (str: string, fromIndex: number, toIndex: number) => string;
declare const stringToLongNumber: (inputString: string) => string;
declare const longNumberToString: (longNumber: string) => string;
declare const formatSeed: (seed: string) => {
    formattedSeed?: string;
    error?: string;
};
declare const modifyCharBySeed: (char: string, seed: string, modifier?: number) => string | null;
declare const compactZeroes: (number: string) => string;
declare const decompactZeroes: (number: string) => string;
declare const compressPixel: (pixel: string) => string;
declare const decrompressPixel: (pixel: string) => string;
declare const pixelate: (string: string, seed: string) => {
    pixel?: string | number;
    error?: string;
};
declare const unpixelate: (pixel: string, seed: string) => {
    result?: string;
    error?: string;
};
//# sourceMappingURL=index.d.ts.map