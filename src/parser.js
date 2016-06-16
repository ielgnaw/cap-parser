/**
 * @file 解析 cap data
 * @author ielgnaw(wuji0223@gmail.com)
 */

import debugMod from 'debug';
import safeStringify from 'json-stringify-safe';
import mockData from './mock-data';

// ((t) => {
//     if (t === 1) {
//         console.warn(1);
//     }
//     else {
//         console.warn('nooo');
//     }
// })()

export function test() {
    return 1;
}

export function parse() {
    const debug = debugMod('cap-parser');
    debug(safeStringify(mockData, null, 4));
}