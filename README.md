grunt-isyn
==========

iSyn的grunt实现版本，支持sass，css, js, image压缩，替换img相对路径，ftp同步，并支持实时刷新。

## 如何使用
进入任意项目子目录，执行以下命令：

1. `grunt init` 自动初始化项目目录
2. `grunt debug` 监听sass修改，手极端增加autoprefixer，对应`grunt md`
3. `grunt`，即可压缩并同步该目录所有文件，手极端对应`grunt m`。
4. `grunt rp`，即可压缩并同步该目录所有文件，并会自动替换图片相对路径，手极端对应`grunt mrp`。


## 初始化
1. Clone`grunt-isyn`，复制`package.json`, `Gruntfile.js`, `iSyn.js`到项目根目录；  
e.g.  
```
$ git clone https://github.com/QQVIPTeam/grunt-isyn.git
$ cd grunt-isyn & mv Gruntfile.js package.json iSyn.sh /path/to/vipstyle
$ rm -fr ../grunt-isyn
```

2. 编辑`package.json`文件，找到`isyn`字段，可更改默认配置，以及填写ftp账户信息。

3. 执行初始化命令；  
安装依赖模块：`npm install`  
初始化isyn：`node iSyn.sh`
4. 开始使用吧。
5. 实时刷新可以用/vipportal/test/html/type.html做测试http://localhost:9000/html/type.html



##项目初始目录结构
```
└── test
    ├── html
    │   └── index.html
    ├── css
    ├── img
    ├── js
    ├── sass
    │   └── style.scss
    ├── pic
    └── psd
```
需要用到include-replace插件的目录结构：

```
└── test
    ├── html
    │   └── index.html
    │   └── src
    │  		  └── index.html
    │   └── include
   	│ 		  └── header.html
   	│ 		  └── footer.html
    ├── css
    ├── img
    ├── js
    ├── sass
    │   └── style.scss
    ├── pic
    └── psd
```
语法很简单：

1. 引用@@include('../include/header.html',{"name": "type","desc": "文本"})
2. header里使用变量@@name


## License
Apache license, Version 2.0
