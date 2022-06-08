
//List dependencies---------------
import gulp from 'gulp';

import sass from 'gulp-sass';
import prefix from 'gulp-autoprefixer';
import minify from 'gulp-clean-css';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import imagewebp from 'gulp-webp';
import notify from 'gulp-notify';  // エラー通知
import plumber from 'gulp-plumber'; // エラー時のタスク停止防
import sassGlob from "gulp-sass-glob";
import debug from 'gulp-debug'; // ログ表示
import dartSass from 'gulp-dart-sass';
//Create functions


//scss
function compilescss(){
	return gulp.src('src/scss/*.scss') //ファイルの元pipeでrunしたいプログラムを書いてく
	.pipe(plumber({
		errorHandler: notify.onError('Error: <%= error.message %>') //エラー通知
	  }))
	.pipe(sassGlob())
	.pipe(sourcemaps.init())
	.pipe(dartSass({
		outputStyle: 'expanded'
	}))
	
	.pipe(sass())
	.pipe(prefix('last 2 versiont'))
	.pipe(minify())
	.pipe(gulp.dest('/dist/css'))
	.pipe(debug({title: 'scss dest:'}))

}

//js
function jsmin(){
	return gulp.src('src/js/*.js')
	.pipe(terser())
	.pipe(gulp.dest('/dist/js'))
}

//images
function optimizeimg(){
	return gulp.src('src/img/*.{jpg,png}')
	.pipe(imagemin([
		imagemin.mozjpeg({
			quality: 80,
			progressive: true
		}),
		imagemin.optipng({
			optimizationLevel: 2
		})

	]))
	.pipe(gulp.dest('/dist/img'))
}

//webp images
function webpImage(){
	return gulp.src('dist/img/*.{jpg, png}')
	.pipe(imagewebp())
	.pipe(gulp.dest('dist/img'))
}

//Create watch tasks.
function watchTask(){
	watch('src/scss/*.scss', compilescss);
	watch('src/js/*.js', jsmin);
	watch('src/img/*.{jpg,png}', optimizeimg);
	watch('dist/img/*.{jpg, png}', webpImage);
}



//default gulp
exports.default = series(compilescss, jsmin, optimizeimg, webpImage, watchTask);