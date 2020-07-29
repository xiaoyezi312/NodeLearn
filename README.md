npm init 
npm i -D @types/node
node index
# 全局对象
1. 
obj.global = obj

window.window
我们平时访问时访问的其实是全局对象window的属性window

2. 
setTimeout 
node 环境中timer是对象，window中是数字

3. 
__dirname :获取当前模块所在目录 不是global里的属性

__filename:

Buffer:类型化数组 继承自UInt8Array
计算机存储的基本单位字节
Buffer.from("sfdffdg", "utf-8"); --》<Buffer xx xx xx xx xx xx xx>
把图片读出来就是一个Buffer,读文件和流操作会用到
()[blog.yuanjin.tech]袁进博客

process 进程
process.cwd() 输出运行node时命令行所在的路径
process.exit([消息码]) 强制退出node进程，不写默认0表示没有错误
process.argv 可以得到命令行参数
```js
console.log(process.argv)
```
```命令行
node index a b c

node的绝对路径
index的绝对路径
a
b
c
```
process.platform  获取当前操作系统
    win32 平台版本表示支持32及以上api
process.kill(进程ID) 杀死进程，相当于在任务管理器里删除

process.env 获取环境变量一个对象 {环境变量名：环境变量值}

# Node模块化细节

require('./src') 如果仅提供目录，不提供文件名则自动寻找目录中的index.js
过程如下
./src
./src.js
./src.json
./src.node
./src.mjs
src 下的 index.js

node ./在导入第三方包中不指定则会根据package.json中的main字段去找

# 基本内置模块
os操作系统相关
    eol换行符
    os.cpus()返回一个数组获取cpu每一个核的信息，一般用于获得cpu有几个核
    os.tmpdir()获得操作系统的临时目录
path用的较多
    - basename("d:\xxx\xxx\aaa.html",扩展名)给个路径返回文件名 
    > filename是d:\xxx\xxx\aaa.html basename是aaa.html
    
    - dirname("d:\xxx\xxx\aaa.html")给路径返回目录
    > d:\xxx\xxx

    - extname("d:\xxx\xxx\aaa.html") 返回后缀名.html
    
    - join("a","b","c","a.js") a/b/c/a.js
        join("a","b","../","a.js") a/a.js a/b返回上一级的a.js
    - resolve("/a.js") 相对命令行process.cwd()
url

util
    callbackify 把一个异步函数promise转换成回调函数的形式
    工程中可能要统一异步处理方式
    inherits 做继承，现在常用Es6class,了解
    promisify把回调转换为异步
    isDeepStrictEqual将两个对象深度严格比较
# 文件I/O
IO的速度往往低于内存和CPU的交互速度
fs模块
Sync函数是同步的，以下每个函数都有个同步函数例：fs.readFileSync

fs.readFile 读取一个文件
    除了在require中相对路径是相对当前文件，其它都是相对命令行，所以一般不用相对路径

fs.writeFile 向文件写入内容

fs.copyFile 复制文件

fs.stat 获取文件或目录信息

fs.readdir 获取目录中的文件和子目录

fs.mkdir 创建目录 创建文件可用readFile传空

fs.exists 判断文件或目录是否存在准备弃用
手写exists
fs.unlink 删除文件
# 文件流
定义：内存数据和硬盘文件数据之间的流动
可读流：Readable 数据从源头流向内存
可写流: Writable 数据从内存流向源头
双工流：Duplex 可读流和可写流的封装
const {Readable, Writable} = require('stream')

## 可读流
```js
const rs = fs.createReadStream(filename, {
  encoding: "utf-8",//读汉字时会读成3个字节
  highWaterMark: 1,//每次读的速度。编码是utf-8就是一个字符，编码是null就是一个字节
  autoClose: true //读完后会自动完毕，默认为true
});

rs.on("open", () => {
  console.log("文件被打开了");
});

rs.on("error", () => {
  console.log("出错了！！");
});

rs.on("close", () => {
  console.log("文件关闭了");
});
//rs.close()手动关闭，文件读完后会自动关闭（autoClose）

//只有注册了这个事件后才会真正的开始读,所以在没注册这个事件之前即使设置了autoClose为true也不会触发close事件，因为只是打开了没有读
rs.on("data", chunk => {
  console.log("读到了一部分数据：", chunk);
  rs.pause(); //暂停 rs.resume()恢复读取
});

rs.on("end", () => {
  console.log("读取完毕");
});

```
如果要读取完整数据直接用readFile就行，没必要用流，因为用流就是为了读一部分仍一部分。用流读完可以设置全局变量每次读完一部分拼接

## 可写流

```js
const ws = fs.createWriteStream(filename, {
  encoding: "utf-8",
  highWaterMark: 16 * 1024(默认), //每次最多能写入的字节，和encoding无关
  flag: "a"
});
const bool = ws.write(data) //data是String或Buffer

ws.end()
// ws.on() -->open close error
```




```js
const bool = ws.write(data) //data是String或Buffer

bool为true data大小，小于等于highWaterMark
    为false data大小，大于highWaterMark
以上理解是错误的
实际：true --> 写入通道没有被填满，接下来的数据可以直接写入，无须排队
    false --> 写入通道目前已被填满，接下来的数据将进入写入队列

举例：设highWaterMark:2
const bool = ws.write('a');
console.log(bool);//true
const bool = ws.write('a');
console.log(bool);//true
const bool = ws.write('a');
console.log(bool);//false
const bool = ws.write('a');
console.log(bool);//false
const bool = ws.write('a');
console.log(bool);//false
因为硬盘处理是很慢的，通道会堵住
```

背压问题：内存积压了很多数据，硬盘写不完
```js
let i = 0;
function write() {
  let flag = true;
  while (i < 1024 * 1024 * 10 && flag) {
    flag = ws.write("a"); //写入a，得到下一次还能不能直接写
    i++;
  }
}

write();
ws.on("drain", () => {//写入队列排满后清空时会触发
  write();
});
```
# net模块
net是一个通信模块，利用它可以实现：
进程间的通信IPC
网络通信 TCP/IP
普通模式：三次握手 四次挥手Tcp/ip
长连接模式：Connection:keep-alive

请求头
请求行


请求体
# http模块

# https
保证数据传输过程中的安全
加密：
对称加密：
非对称加密：产生一对密匙，一个用于加密，一个用于解密

有A B两人
B:产生公私钥，将公钥给A
A:产生对称加密key,将key用公钥发送给B
A,B间用key联系

证书
# node生命周期
宏：timers poll check(setImmediate会进入)

setImmediate效率要比setTimeout高很多
setTimeout实际取不到0
```js
setTimeout(()=>{
  console.log("setTimeout");
},0);
setImmediate(()=>{
  console.log("setImmediate");
});

输出：setTimeout setImmediate
或者setImmediate setTimeout 都有可能
```

```js
const fs = require("fs");
fs.readFile("./index.js",()=>{
  setTimeout(()=>{
  console.log("setTimeout");
},0);

setImmediate(()=>{
  console.log("setImmediate");
});
})

肯定先输出setImmediate
```

微：
nextTick 优先级大
promise

最快的异步函数nextTick
