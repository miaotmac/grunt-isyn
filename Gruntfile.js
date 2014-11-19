/**
 * Grunt iSyn
 */

'use strict';

module.exports = function(grunt) {
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

		// js minify
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

		// css minify
		cssmin: {
			main: {
				files: [{
					expand: true,
					cwd: PWD,
					src: ['**/*.css', '**/!*.min.css'],
					dest: buildDir
				}]
			}
		},
		autoprefixer: {

            		options: {
                		browsers: ['ios 5','android 2.3']
            		},

            		// prefix all files
            		multiple_files: {
                		expand: true,
                		cwd: PWD,
                		src: ['**/*.css', '**/!*.min.css'],
                		dest: PWD
            		}
        	},
		// image compress
		imagemin: {
			compile: {
				files: [{
					expand: true,
					cwd: PWD,
					src: ['**/*.{jpg,gif}'],
					dest: buildDir
				}]
			}
		},

		// png image compress
		pngmin: {
			compile: {
				options: {
					ext: '.png'
				},
				files: [{
					expand: true,
					cwd: PWD,
					src: ['**/*.png'],
					dest: buildDir
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
		}
	});
	
	// loadNpmTasks
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-pngmin');
	grunt.loadNpmTasks('grunt-autoprefixer');

	// default
	grunt.registerTask('default', ['copy','autoprefixer', 'cssmin', 'uglify', 'imagemin', 'pngmin', 'ftp-deploy', 'synclog']);

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
};
