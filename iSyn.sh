#!/usr/bin/env node

'use strict';

console.log('正在部署isyn...');

var fs = require('fs-extra');

// 创建ftp帐号数据文件
var pkg = fs.readJsonSync('package.json', {throws: false}),
	ftpConfig = pkg.isyn.ftp;

var ftppass = {};
	ftppass[ftpConfig.authKey] = {
		username: ftpConfig.username,
		password: ftpConfig.password
	};

fs.writeFileSync(ftpConfig.authPath, JSON.stringify(ftppass, '', '\t'));

console.log('isyn部署成功，开始使用吧，enjoy!');