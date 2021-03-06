/**
 * @file 解析 cap data
 * @author ielgnaw(wuji0223@gmail.com)
 */

export default class Parser {
    constructor(data = {keyframes: []}) {
        this.keyframes = data.keyframes;
        this.keyframesLen = data.keyframes.length;

        // 关键帧 keyframes 索引的数组
        this.keyframesIndexMap = this._getKeyframeIndexs();
    }

    /**
     * 获取关键帧索引的数组，即 keyframes 中每个 item 的 index 属性的集合
     *
     * @return {Array} 关键帧索引的数组
     */
    _getKeyframeIndexs() {
        const map = {};
        this.keyframes.forEach(item => {
            map[item.index] = item;
        });
        return map;
    }

    /**
     * 根据帧数获取当前帧数的 layers，传入的帧数可能不是关键帧
     *
     * @param {number} frameIndex 传入的帧数
     *
     * @return {Object} 当前帧数对应的对象
     */
    getLayerDataByFrameIndex(frameIndex) {
        // 当前传入的帧数就是关键帧
        if (this.keyframesIndexMap[frameIndex]) {
            return this.keyframesIndexMap[frameIndex];
        }
        else {
            console.log(frameIndex);
        }
    }

    /**
     * 根据指定的帧数即 data.keyframes[keyframe].index 这个值来获取对应的 keyframe 的 layers
     * 另外，要把 index 从 0 到最后的值都包括在内，数据中没有的帧数需要算出来
     * 1. index <= this.boundaryData.minIndex 那么返回的就是 minIndex 对应的那个 keyframe 的 layers
     * 2. index >= this.boundaryData.maxIndex 那么返回的就是 maxIndex 对应的那个 keyframe 的 layers
     * 3. this.boundaryData.minIndex < index < this.boundaryData.maxIndex
     *     那么返回 computed(this.boundaryData.minIndex, this.boundaryData.maxIndex, this.boundaryData.minIndex.fx)
     *
     * @example
     *     已知：
     *     data.totalFrame = 5;
     *     data.keyframes = [{index: 1, layers: [...]}, {index: 3, layers: [...]}]
     *     这种情况下，所有的帧数据如下
     *     data.keyframes = [
     *         {index: 0, layers: [...]}, 同 index1
     *         {index: 1, layers: [...]},
     *         {index: 2, layers: [...]}, 根据 index1 的值、index3 的值 以及 index1 的 fx 计算得到
     *         {index: 3, layers: [...]},
     *         {index: 4, layers: [...]}, 同 index3
     *     ]
     */
    // getLayersByKeyframe(index) {
    //     const bData = this.boundaryData;
    //     const map = bData.keyframeMap;
    //     const originalLayers = this.layers;

    //     // 如果传入的 index 在 keyframes 中的 index 正好存在，那么直接返回
    //     if (map[index]) {
    //         return map[index];
    //     }

    //     const minIndex = bData.minIndex;

    //     // index < minIndex，直接返回 minIndex 对应的那个 keyframe 的 layers
    //     if (index < minIndex) {
    //         return map[minIndex];
    //     }

    //     const maxIndex = bData.maxIndex;

    //     // index > maxIndex，直接返回 maxIndex 对应的那个 keyframe 的 layers
    //     if (index > maxIndex) {
    //         return map[maxIndex];
    //     }

    //     // 运行到这里，就代表传入的 index 在 keyframes 中不存在，这个传入的 index 前后一定在 keyframes 中存在

    //     // 1. 找出 index 的前一关键帧和后一关键帧的 index
    //     const aroundIndex = getAroundData(index, bData.allKeyframeIndex);

    //     // 2. 根据 aroundIndex 以及 aroundIndex[0] 的 fx 计算出当前 index 对应的 layers 的值，最终要拿默认值做 merge，需要返回全值
    //     // 先找到 aroundIndex[0] 的 layers 里面有哪些 layer，看看这些 layer 在 aroundIndex[1] 的 layers 里是否存在
    //     // 如果不存在，那么直接返回 aroundIndex[0] 的 layers 里的这个 layer 的值（和默认值 merge 后）
    //     // 如果存在，那么需要根据 aroundIndex[1] 和 aroundIndex[0] 的 layer 的值以及 aroundIndex[0] 的 fx 来计算出
    //     // 当前 index 对应的 layers 的值并且最后要和默认值做 merge
    //     // (后面的值 - 前面的值) / 差值
    //     // (aroundIndex[1].layers.layer.properties - aroundIndex[0].layers.layer.properties) / aroundIndex[3]

    //     const beforeLayers = map[aroundIndex[0]];
    //     const afterLayers = map[aroundIndex[1]];

    //     const layerIdsInAfterLayers = {};
    //     for (const afterLayer of afterLayers) {
    //         layerIdsInAfterLayers[afterLayer.id] = afterLayer;
    //     }

    //     const ret = {
    //         index: index,
    //         layers: [],
    //         // 先把结果缓存在 map 中，便于之后和 originalLayer merge
    //         layersMap: {}
    //     };

    //     for (const beforeLayer of beforeLayers) {
    //         let _afterLayer = layerIdsInAfterLayers[beforeLayer.id];

    //         // 如果 afterLayer 中存在，但是 beforeLayer 中不存在，那么直接返回 beforeLayer 的数据
    //         if (!_afterLayer) {
    //             ret.layersMap[beforeLayer.id] = beforeLayer;
    //         }
    //         // afterLayer 和 beforeLayer 中都存在，那么根据 beforeLayer 和 afterLayer 对应的属性以及 beforeLayer 属性的 fx 来计算
    //         else {
    //             console.warn(beforeLayer);
    //             console.warn(_afterLayer);
    //             for (let beforeProperty of Object.keys(beforeLayer)) {
    //                 if (beforeProperty === 'id') {
    //                     continue;
    //                 }
    //                 let before = beforeLayer[beforeProperty];
    //                 let after = _afterLayer[beforeProperty];
    //                 if (!before || !after) {
    //                     continue;
    //                 }

    //                 let tmp = ret.layersMap[beforeLayer.id] = {};
    //                 tmp[beforeProperty] = {};

    //                 let step = index - aroundIndex[0];
    //                 console.warn(aroundIndex);

    //                 // 处理有 x y z 的属性
    //                 ['x', 'y', 'z'].forEach((prop) => {
    //                     if (before[prop] && after[prop]) {
    //                         tmp[beforeProperty][prop] = {
    //                             value: ((after[prop].value - before[prop].value) / aroundIndex[2])
    //                                 * ((index - aroundIndex[0]) + before[prop].value),
    //                             fx: 'linear'
    //                         }
    //                     }
    //                 });
    //             }
    //         }
    //     }


    //     // 和默认值做 merge
    //     for (const originalLayer of originalLayers) {
    //         if (ret.layersMap[originalLayer.id]) {
    //             ret.layers.push(extend(true, {}, originalLayer, ret.layersMap[originalLayer.id]));
    //         }
    //     }

    //     // console.warn(safeStringify(ret, null, 4));
    //     // console.warn(ret);
    //     return ret;
    // }

    // /**
    //  * 分析当前的状态
    //  * 本质上状态只分为三种，
    //  * 1. 小于等于最左
    //  * 2. 大于等于最后
    //  * 3. 中间
    //  *
    //  * @param {number} n 传入的 start 或者 end
    //  *
    //  * @return {number} 状态值
    //  */
    // analyzeState(n) {
    //     let state = -2;

    //     return state;
    // }

    // // 只传入 start 的情况
    // // start | no index => start = default, end = default
    // // start | index1 | index2 | index3  => start = default, end = index3
    // // start = index1 | index2 | index3  => start = index1, end = index3
    // // index1 | start | index2 | index3  => start = computed(index1, index2, index1.fx), end = index3
    // // index1 | start = index2 | index3  => start = index2, end = index3
    // // index1 | index2 | start | index3  => start = computed(index2, index3, index2.fx), end = index3
    // // index1 | index2 | start >= index3  => start = index3, end = index3
    // parse(start) {
    //     // console.warn(this.boundaryData);
    // }

}
