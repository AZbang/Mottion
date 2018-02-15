const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const browserifyShader = require('browserify-shader');
const watchify = require('watchify');

// server
gulp.task('server', () => {
	return connect.server({
		port: 3338,
		livereload: true,
		root: './dist'
	});
});

function compile(watch) {
  var bundler = watchify(
		browserify('./src/index.js', { debug: true })
		.transform(browserifyShader)
	);

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'))
			.pipe(connect.reload());
  }

  if(watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
}

gulp.task('build', () => compile());
gulp.task('watch', () => watch());
gulp.task('default', ['server', 'watch']);
