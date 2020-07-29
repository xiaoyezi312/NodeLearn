const path = require('path');
const fs = require('fs');
const filename = path.resolve(__dirname, "./myfiles/1.txt");
fs.readFile(filename, 'utf-8', (err, content) => {
    console.log(content);
})


// async function test() {
//     const content = await fs.promises.readFile(filename);
//     //不写编码格式返回一个Buffer
//     const content = await fs.promises.readFile(filename, 'utf-8');
//     console.log(content);
// }

// async function test() {
//     //编码默认utf-8所以可以不用写，第二个参数可以写Buffer
//     await fs.promises.writeFile(filename,"方式发生过",{
//         flag: "a" //append追加内容，不写默认覆盖 "w"表覆盖
//     });
// }

async function test() {
    const stats = await fs.promises.stat(filename);
    console.log(stats);
    console.log('是否是目录', stats.isDirectory());
    console.log('是否是文件', stats.isFile());
}
//目录(文件夹)size为0,因为只是一个指针没有数据
// Stats {
//     dev: 1824729373,      
//     mode: 33206,
//     nlink: 1,
//     uid: 0,
//     gid: 0,
//     rdev: 0,
//     blksize: 4096,        
//     ino: 5348024557846577,
//     size: 158,     占用字节
//     blocks: 0,
//     atimeMs: 1595932317375.646, 
//     mtimeMs: 1595932317375.646,
//     ctimeMs: 1595932317375.646,
//     birthtimeMs: 1595932249318.2324,
//     atime: 2020-07-28T10:31:57.376Z, 上次访问时间
//     mtime: 2020-07-28T10:31:57.376Z,  上次文件内容被修改时间
//     ctime: 2020-07-28T10:31:57.376Z,
//     birthtime: 2020-07-28T10:30:49.318Z 文件创建时间
//   }

const dirname = path.resolve(__dirname, "./myfiles");
async function test() {
    const dir = await fs.promises.readdir(dirname);
    console.log(dir);
}
test();