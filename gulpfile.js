var gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	merge = require('merge-stream'),
	cleanCSS = require('gulp-clean-css'), //- 压缩CSS为一行；  
	ugLify = require('gulp-uglify'), //压缩js  
	htmlMin = require('gulp-htmlmin'), //压缩html
	changed = require('gulp-changed'), //检查改变状态  
	less = require('gulp-less') //less转css  
	del = require('del')//文件删除
	browserSync = require("browser-sync").create(); //浏览器实时刷新  
	autoprefixer = require('gulp-autoprefixer'); //自动补齐前缀

//删除dist下的所有文件  
gulp.task('delete', function(cb) {
	return del(['dist/*'], cb);
})

//文件夹js
gulp.task("script", function() {
	gulp.src('./src/js/**/*')
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

// 压缩图片  
gulp.task('images', function() {
	gulp.src('./src/images/**/*')
	.pipe(gulp.dest('dist/images'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

//插件注入
gulp.task('plugin', function() {
	gulp.src('./src/plugin/**/*')
	.pipe(gulp.dest('dist/plugin'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

//压缩html  
gulp.task('html', function() {
	var options = {
		removeComments: false, //清除HTML注释  
		collapseWhitespace: false, //压缩HTML  
		removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"  
		removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"  
		minifyJS: true, //压缩页面JS  
		minifyCSS: true //压缩页面CSS  
	};
	//删除文件
	del(['dist/*.html']);
	gulp.src('src/*.html')
//	.pipe(changed('dist', {
//		hasChanged: changed.compareSha1Digest
//	}))
	.pipe(htmlMin(options))
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.reload({
		stream: true
	}));
});
//实时编译less
//并且自动补齐
gulp.task('less', function() {
	gulp.src(['./src/css/*.*'])
	//自动补齐
	.pipe(autoprefixer({
		browsers: ['last 3 versions'],//兼容到ie9
		cascade: true,
		remove: true
	}))
	.pipe(less())//编译less文件  
	.pipe(cleanCSS())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({
		stream:true
	}));
	
});

//启动热更新  
gulp.task('serve',['delete'], function() {
	gulp.start('less', 'html', 'script', 'images', 'plugin');
	browserSync.init({
		port: 2017,
		server: {
			baseDir: ['dist']
		}
	});
	gulp.watch('src/js/**/*.js',function(){
		del(['dist/js/**/*']).then(paths => {
			console.log('js目录清理成功,正在重新编译:\n', paths.join('\n'));
			gulp.run("script",function(){
				console.log("js目录重新编译成功");
			});
		});
	});
	gulp.watch('src/css/*.*',function(){
		del(['dist/css/*.css']).then(paths => {
			console.log('css目录清理成功,正在重新编译:\n', paths.join('\n'));
			gulp.run("less",function(){
				console.log("css目录重新编译成功");
			});
		});
	});
	gulp.watch('src/*.html',function(){
		del(['dist/*.html']).then(paths => {
			console.log('html清理成功,正在重新编译:\n', paths.join('\n'));
			gulp.run("html",function(){
				console.log("html重新编译成功");
			});
		});
	});
	gulp.watch('src/images/**/*',function(){
		del(['dist/images/**/*']).then(paths => {
			console.log('images目录清理成功,正在重新编译:\n', paths.join('\n'));
			gulp.run("images",function(){
				console.log("images目录重新编译成功");
			});
		});
	});
});

gulp.task('default', ['serve']);