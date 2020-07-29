console.log("当前模块路径：", __dirname);
console.log("当前模块文件：", __filename);
//一开始this===exports===moudle.exports

// this.m = 5;
// exports.c = 3;
// module.exports = {
//     a: 1,
//     b: 2
// };
// 导出：{a:1, b:2} 因为moudle.exports指向了新的对象，但返回的是moudle.exports

exports.c = 3;
module.exports.a = 1;
module.exports.b = 2;
this.m = 5;

// 导出：{c: 3, a: 1, b: 2, m: 5}