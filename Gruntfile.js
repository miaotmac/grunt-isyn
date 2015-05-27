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

	var PWD = process.env.PWD, // current cmd dir
		buildDir = path.join(path.resolve(PWD, '../'), path.basename(PWD) + '_tmp'); // tmp folder
	
	
	grunt.initConfig({
		pkg: pkg,
		//copy all to dest dir
		copy: {
			main: {
				expand: true,
				cwd: PWD,
				src: ['**/*', '!**/node_modules/**', '!**/.svn/**', '!**/.git/**'],
				dest: buildDir
			}
		},

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
		sass: {
            main: {
                expand: true,
                cwd: PWD + '/sass',
                src: ['**/*.scss'],
                dest: PWD + '/css',
                ext:'.css'
            },
            debug:{
            	expand: true,
                cwd: PWD + '/sass',
                src: ['**/*.scss'],
                dest: PWD + '/css-debug',
                ext:'.css'
            }

        },
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
        // css minify
		cssmin: {
			main: {
				files: [{
					expand: true,
					cwd: PWD,
					src: ['css/**/*.css', 'css/!*.min.css'],
					dest: buildDir
				}]
			},
			debug:{
				files: [{
					expand: true,
					cwd: PWD + '/css-debug',
					src: ['**/*.css'],
					dest: PWD + '/css'
				}]
			}
		},
		replace:{
			dist: {
				src: buildDir + '/css/**/*.css',
				overwrite: true,
				replacements: [{
			      	from: /\(.*\.\//g, 
			      	to: function () {
        				return '(/' + path.relative(process.env.HOME,PWD) + '/';
      				}
			    }]

			}
		},
		// image compress
		imagemin: {
			compile: {
				files: [{
					expand: true,
					cwd: PWD,
					src: ['**/*.{png,jpg,gif}'],
					dest: PWD
				}]
			}
		},

		// png image compress
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

		// ftp sync
		'ftp-deploy': {
			build: {
				auth: {
					host: ISYN.ftp.host,
					port: ISYN.ftp.port,
					authPath: ISYN.ftp.authPath,
					authKey: ISYN.ftp.authKey
				},
				src: buildDir,
				dest: getFtpDest(PWD),
				exclusions: ['.DS_Store', 'Thumbs.db']
			}
		},

		// clear build files
		clean: {
			build: {
				options: {
					force: true
				},
				src: buildDir
			}
		},
		watch:{
			css: {
                files: [
                    PWD + '/sass/**/*.scss'
                ],
                tasks: ['sass']
            }
		}
	});
	
	grunt.registerTask('init',function() {
		var dirs = ['html','css','sass','img','pic','psd','js'];
		dirs.forEach(function (item, index) {
			fs.mkdirSync(path.join(PWD+ '/'+ item));
		});
		fs.writeFileSync(path.join(PWD+ '/html/index.html'),'');
		fs.writeFileSync(path.join(PWD+ '/sass/style.scss'),'@charset "utf-8";');
	});
	// default
	grunt.registerTask('default', ['copy','sass','cssmin','imagemin','uglify', 'ftp-deploy', 'synclog']);
	grunt.registerTask('m', ['copy','sass','autoprefixer','cssmin','imagemin','uglify','replace','ftp-deploy', 'synclog']);
	grunt.registerTask('debug', ['sass','synclog','watch']);
	grunt.registerTask('md', ['sass','autoprefixer','synclog','watch']);
	//replace
	grunt.registerTask('rp', ['copy','sass','cssmin','imagemin','uglify', 'replace','ftp-deploy', 'synclog']);
	grunt.registerTask('mrp', ['copy','sass','autoprefixer','cssmin','imagemin','uglify','replace','ftp-deploy', 'synclog']);
	// synclog
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
		console.log('test');
	});
	
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
	function isHaveSass (argument) {
		// body...
	}
};