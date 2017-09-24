const gulp = require('gulp');
const browserify = require('gulp-browserify');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');

var isDev = process.env.DEV !== 'production';
var errorMessage = () => {
	return plumber({errorHandler: notify.onError((err) => {
		return {
			title: err.name,
			message: err.message
		}
	})})
}

gulp.task('js', () => {
	return gulp.src('./src/index.js', {read: false})
		.pipe(errorMessage())
		.pipe(browserify({
			debug: isDev
		}))
		.pipe(gulpIf(!isDev, babel({
			presets: ['es2015']
		})))
		.pipe(gulpIf(!isDev, uglify()))
		.pipe(gulp.dest('./www'))
		.pipe(connect.reload());
});


// server
gulp.task('server', () => {
	return connect.server({
		port: 1338,
		livereload: true,
		root: './www'
	});
});


// Watch files
gulp.task('watch', () => {
	gulp.watch('./src/**/*.*', ['js']);
});

// Tasks
gulp.task('default', ['js', 'server', 'watch']);
