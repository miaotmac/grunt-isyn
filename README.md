grunt-isyn
==========

iSyn的grunt实现版本，支持sass，css, js, image压缩并ftp同步。

## 如何使用
进入任意项目子目录，执行以下命令：

1. `grunt init` 自动初始化项目目录
2. `grunt debug` 监听sass修改，手极端增加autoprefixer，对应`grunt md`
3. `grunt`，即可压缩并同步该目录所有文件，手极端对应`grunt m`。


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



##项目初始目录结构
```
└── src
    ├──	html
    │   └── index.html
    ├── css
    ├── img
    ├── js
    ├── sass
    │   └── style.scss
    ├── pic
    └── psd
```

## License
Apache license, Version 2.0