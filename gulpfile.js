const gulp = require('gulp');
const browserify = require('browserify');
const connect = require('gulp-connect');
const notifier = require('node-notifier');
const babelify = require('babelify');
const source = require('vinyl-source-stream')
const browserifyShader = require('browserify-shader');
const gulpIf = require('gulp-if');

var isDev = process.env.DEV !== 'production';

gulp.task('js', () => {
	return browserify({entries: './src/index.js', debug: isDev})
    .transform(browserifyShader)
		// .transform(babelify, { presets: ['es2015'] })
    .bundle()
			.on('error', (err) => {
				console.log(err.message);
				notifier.notify({
		      'title': 'JS Error',
		      'message': err.message
		    });
			})
      .pipe(source('app.js'))
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
