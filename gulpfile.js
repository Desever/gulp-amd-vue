var gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	merge = require('merge-stream'),
	cleanCSS = require('gulp-clean-css'), //- 压缩CSS为一行；  
	ugLify = require('gulp-uglify'), //压缩js  
	htmlMin = require('gulp-htmlmin'), //压缩html
	changed = require('gulp-changed'), //检查改变状态  
	less = require('gulp-less') //less转css  
	del = require('del')
	browserSync = require("browser-sync").create(); //浏览器实时刷新  

//删除dist下的所有文件  
gulp.task('delete', function(cb) {
	return del(['dist/*', '!dist/images'], cb);
})
var scriptsPath = 'src/js';
function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(function(file) {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}
//文件夹js
gulp.task("script", function() {
	
	console.log(1)
	
	var folders = getFolders(scriptsPath);
	var tasks = folders.map(function(folder) {
		// 压缩
		return gulp.src(path.join(scriptsPath, folder, '/*.js'))
			.pipe(ugLify())
			.pipe(gulp.dest("dist/js/" + folder))
			.pipe(browserSync.reload({
				stream: true
			}));
	});
	return merge(tasks);
});

// 压缩图片  
gulp.task('images', function() {
	gulp.src('./src/images/*.*')
		.pipe(gulp.dest('dist/images'))
});

//压缩html  
gulp.task('html', function() {
	var options = {
		removeComments: true, //清除HTML注释  
		collapseWhitespace: true, //压缩HTML  
		removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"  
		removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"  
		minifyJS: true, //压缩页面JS  
		minifyCSS: true //压缩页面CSS  
	};
	gulp.src('src/*.html')
		.pipe(changed('dist', {
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(htmlMin(options))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({
			stream: true
		}));
});
//实时编译less  
gulp.task('less', function() {
	gulp.src(['./src/css/*.less']) //多个文件以数组形式传入  
		.pipe(changed('dist/css', {
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(less()) //编译less文件  
		.pipe(cleanCSS()) //压缩新生成的css  
		.pipe(gulp.dest('dist/css')) //将会在css下生成main.css  
		.pipe(browserSync.reload({
			stream: true
		}));
});

/**
 * 压缩css
 */
gulp.task('css', function() {
	gulp.src(['./src/css/*.css']) //多个文件以数组形式传入  
		.pipe(changed('dist/css', {
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(cleanCSS()) //压缩新生成的css  
		.pipe(gulp.dest('dist/css')) //将会在css下生成main.css  
		.pipe(browserSync.reload({
			stream: true
		}));
});

//启动热更新  
gulp.task('serve', ['delete'], function() {
	gulp.start('less', 'html', 'css', 'script', 'images');
	browserSync.init({
		port: 2017,
		server: {
			baseDir: ['dist']
		}
	});
	gulp.watch('src/js/*/*.js', ['script']);
	gulp.watch('src/css/*.less', ['less']);
	gulp.watch('src/css/*.css', ['css']);
	gulp.watch('src/*.html', ['html']);
	gulp.watch('src/images/*.*', ['images']);
});

gulp.task('default', ['serve']);