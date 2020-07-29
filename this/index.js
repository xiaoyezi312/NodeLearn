// function require(moudlePath) {
//     1. 将moudlePath转换为绝对路径： C: \Users\ 32341\ Desktop\ NodeLearn\ myMoudle.js
//     2. 判断是否该模块已有缓存, 如果有
//     if (require.cache["C:\Users\32341\Desktop\NodeLearn\myMoudle.js"]) {
//         return 该模块运行结果
//     }
//     3. 如果没有读取文件内容
//     4. 包裹到一个函数

//     function __temp(moudle, exports, require, __dirname, __filename) {
//         console.log("当前模块路径：", __dirname);
//         console.log("当前模块文件：", __filename);
//         this.m = 5;
//         exports.c = 3;
//         module.exports = {
//             a: 1,
//             b: 2
//         };
//     }
//     5. 创建moudle对象
//     moudle.exports = {};
//     const exports = module.exports;
//     6. 调用函数
//     __temp.call(moudle.exports,moudle, exports, require, module.path,moudle.filename )
//     7.返回
//     return moudle.exports
// }


const result = require("./myModule");
console.log(result);