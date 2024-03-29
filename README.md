grunt-isyn
==========

iSyn的grunt实现版本，支持sass，css, js, image压缩，替换img相对路径，ftp同步，并支持实时刷新。

## 如何使用
进入任意项目子目录，执行以下命令：

1. `grunt init` 自动初始化项目目录
2. `grunt` 默认监听sass修改，开启127.0.0.1，必须在项目根目录执行，手极端增加autoprefixer，对应命令为`grunt m`
3. `grunt img` 压缩图片
4. `grunt push` 提交ftp，默认提交当前目录，如果要提交指定文件使用
`grunt push:bg.png:vip/vip_9.png`，冒号后面是文件相对当前目录的路径，如果只提交修改的文件后面加`--simple`


## 初始化
1. Clone`grunt-isyn`，复制`package.json`, `Gruntfile.js`, `iSyn.js`到vipstyle目录（win环境需要放在每个项目的根目录）；  
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



##项目初始目录结构：

注意文件名用下划线，css用中划线

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

需要用到其他目录结构：

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
    ├── psd
   	├── sprite 雪碧图小图
    ├── jinja 模板引擎
    │ └── index.html
    │   └── include
   	│  		  ├── header.html
   	│ 	 	  └── footer.html
    └── component 项目公用组件
    
```


## License
Apache license, Version 2.0
