/**
 * Grunt iSyn
 */

'use strict';

module.exports = function(grunt) {

	// 自动加载 grunt 任务
    require('load-grunt-tasks')(grunt);

	var path = require('path'),
		fs = require('fs-extra'),
		log = grunt.log,
		pkg = grunt.file.readJSON('package.json'),
		ISYN = pkg.isyn;

	var PWD = process.env.PWD || process.cwd(),  // 获取当前文件路径，兼容 windows
		buildDir = path.join(path.resolve(PWD, '../'), path.basename(PWD) + '_tmp'), // tmp folder
	    pushDir = ['**/*', '!**/node_modules/**', '!**/.svn/**', '!**/.git/**', '!**/.sass-cache/**'];
	


	// grunt 初始化任务
	//=================

	grunt.initConfig({

		// 拷贝文件到指定目录
		copy: {
			main: {
				expand: true,
				cwd: PWD,
				src: pushDir,
				dest: buildDir
			}
		},

		// 代码混淆
		uglify: {
			options: {
				mangle: {
					except: ['zepto','$','module','require','exports','define']
				}
		    },
			dist: {
				files: [{
					expand: true,
					cwd: PWD,
					src: ['**/*.js', '!node_modules/**/*.js'],
					dest: buildDir
				}]
			}
		},

		// sass 编译
		sass: {
            main: {
                expand: true,
                cwd: PWD + '/sass',
                src: ['**/*.scss'],
                dest: PWD + '/css',
                ext:'.css',
                options: {				// Target options
                    style: 'compressed'
                }
            },
            debug:{
            	expand: true,
                cwd: PWD + '/sass',
                src: ['**/*.scss'],
                dest: PWD + '/css-debug',
                ext:'.css'
            }
        },

        // Compass 编译 sass（支持雪碧图合并）
        compass: {
		    dist: {
		      options: {
		        sassDir: 'sass',
		        cssDir: 'css',
		        sourcemap: false,
		        config: 'config.rb',
		        specify: ['sass/**/*.scss'],	// 这里可以指定要编译的文件
		        outputStyle: 'compressed'
		      }
		    }
		},

		// 自定添加前缀
		autoprefixer: {
            options: {
                browsers: ['last 2 versions','ios 5','android 2.3']
            },
            // prefix all files
            multiple_files: {
                expand: true,
                cwd: PWD,
                src: ['**/*.css', '**/!*.min.css'],
                dest: PWD
            }
        },

        // CSS 压缩
		cssmin: {
			main: {
				files: [{
					expand: true,
					cwd: buildDir,
					src: ['**/*.css', '!*.min.css'],
					dest: buildDir
				}]
			}
		},

		// 替换相对路径
		replace:{
			dist: {
				src: [buildDir + 'css/**/*.css', buildDir + '/html/**/*.html'] ,
				overwrite: true,
				replacements: [{
			      	from: /\.*\.\/img/g, 
			      	to: function () {
        				return '/' + path.relative(process.env.HOME,PWD) + '/img';
      				}
			    }]
			}
		},

		// JPG/GIF 图片压缩
		imagemin: {
			compile: {
				files: [{
					expand: true,
					cwd: PWD,
					src: ['**/*.{jpg,gif}'],
					dest: PWD
				}]
			}
		},

		// PNG 图片压缩
		pngmin: {
			compile: {
				options: {
					ext: '.png',
					force: true 
				},
				files: [{
					expand: true,
					cwd: PWD,
					src: ['**/*.png'],
					dest: PWD
				}]
			}
		},

		// FTP 提交
		'ftpush': {
			build: {
				auth: {
					host: ISYN.ftp.host,
					port: ISYN.ftp.port,
					authPath: ISYN.ftp.authPath,
					authKey: ISYN.ftp.authKey
				},
				src: buildDir,
				dest: getFtpDest(PWD),
				exclusions: ['.DS_Store', 'Thumbs.db'],
                simple: true
			}
		},

		// HTML 合并
		includereplace: {
            html: {
                expand: true,
                cwd: PWD +'/html/src',
                src: ['**/*.html'],
                dest: PWD + '/html'

            }
        },

		// 删除临时编译目录
		clean: {
			build: {
				options: {
					force: true
				},
				src: buildDir
			}
		},

		// 开启服务器
		connect: {
            options: {
                port: 9000,
                hostname: '127.0.0.1', 	//默认就是这个值，可配置为本机某个 IP，localhost 或域名
                livereload: 35729  		//声明给 watch 监听的端口
            },
            server: {
                options: {
                    open: true, //自动打开网页 http://
                    base: [
                        PWD + '' //主目录
                    ]
                }
            }
        },

        // 监听文件变动
		watch:{
			css: {
                files: [
                    PWD + '/sass/**/*.scss'
                ],
                tasks: ['compass']
            },
            include: {
                files: [
                    PWD + '/html/src/**/*.html',
                    PWD + '/html/include/**/*.html',
                ],
                tasks: ['includereplace']
            },
            livereload:{ 
                options:{  
                    livereload: true  
                },  
                files:[ PWD + '/css/**/*.css', PWD +'/js/**/*.js', PWD + '/html/**/*.html']  
            }  

		}
	});



	// grunt 执行命令
	//=================

	// 启动服务器及监听
	grunt.registerTask('server', [
        'connect:server',
        'watch'
    ]);


	// 初始化文件目录
	grunt.registerTask('init',function() {
		var dirs = ['html','css','sass','img','pic','psd','js'];
		dirs.forEach(function (item, index) {
			fs.mkdirSync(path.join(PWD + '/'+ item));
		});
		fs.writeFileSync(path.join(PWD + '/html/index.html'),'');
		fs.writeFileSync(path.join(PWD + '/sass/style.scss'),'@charset "utf-8";');
	});


	// default
    grunt.registerTask('default', ['compass','server']);

    // defaut + 添加前缀
    grunt.registerTask('m', ['compass','autoprefixer','server']);

    // 图片压缩
    grunt.registerTask('img', ['imagemin','pngmin']);

    // FTP 提交
    grunt.registerTask('push','传文件',function(){
        if(this.args.length){
            pushDir = this.args;
            grunt.config('copy.main.src', pushDir);
        }
        grunt.task.run('copy','cssmin','ftpush','synclog');
    });


	//replace
	// grunt.registerTask('rp','替换url并传文件',function(){
 //        if(this.args.length){
 //            pushDir = this.args;
 //            grunt.config('copy.main.src', pushDir);
 //        }
 //        grunt.task.run('copy','cssmin','replace','ftpush','synclog');
 //    });


	// 输出提交目录
	grunt.registerTask('synclog', 'log remote sync prefix paths.', function() {
		console.log('Remote sync prefix paths:');
		var files = walkDirectory(path.resolve(PWD, buildDir));
		
        files.forEach(function (item, index) {
			item = path.relative(buildDir, item);
			item = path.join(getPrefixPath(PWD), item);
			console.log(item.green);
		});

		// remove tmp files
		grunt.task.run('clean');
	});



	// test 
	grunt.registerTask('test', function () {
	});



	



	// 函数
	//==================

	// get ftp dest dir
	function getFtpDest (pwd) {
		var s = pwd.split(ISYN.localRootDirName),
			dest = '/';
		if (s[1]) {
			dest = path.resolve(dest, s[1]);
		}
		return dest;
	}

	// get prefix path
	function getPrefixPath (pwd) {
		return ISYN.remoteSyncPrefixPath + getFtpDest(pwd);
	}

	/**
	 * Get all matching files in the directory
	 * @param  {reing} root    dir path
	 * @return {array}         result files
	 */
	function walkDirectory(root) {
		var files = [];

		if (!fs.existsSync(root)) {
			return [];
		}

		function walk(dir) {
			var dirList = fs.readdirSync(dir);
			for (var i = 0; i < dirList.length; i++) {
				var item = dirList[i];
				//fiter system files
				if (/^\./.test(item)) {
					continue;
				}

				if (fs.statSync(path.join(dir, item)).isDirectory()) {
					try {
						walk(path.join(dir, item));
					} catch (e) {

					}
				} else {
					files.push(path.join(dir, item));
				}
			}
		}
		walk(root);
		return files;
	}

};