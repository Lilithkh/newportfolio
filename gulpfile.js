var gulp = require('gulp'),
    clone = require('gulp-clone'),
    merge = require('gulp-merge'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    wait = require('gulp-wait'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    postcss = require('gulp-postcss'),
    filter = require('gulp-filter'),
    lineec = require('gulp-line-ending-corrector'),
    notify = require('gulp-notify');


// CSS via Sass and Autoprefixer
gulp.task('styles', function() {
  return gulp
    .src('./src/sass/**/*.scss', { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(wait(500))
    .pipe(
      sass({
        outputStyle: 'nested',
        indentType: 'tab',
        indentWidth: 1
      })
    )
    .on('error', sass.logError)
    .pipe(postcss([autoprefixer]))
    .pipe(lineec())
    .pipe(gulp.dest('./src/css'))
    .pipe(browserSync.stream())
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(lineec())
    .pipe(gulp.dest('./src/css'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: '\n\n✅  ===> STYLES — completed!\n', onLast: true }));
});



// Bundle and minify JS scripts
gulp.task('scripts', function() {
  return gulp.src([
    './src/js/*.js',
    '!./src/js/jquery.min.js',
    '!./src/js/scripts.min.js'
  ])
    .pipe(concat('scripts.js'))
    .pipe(minify({
      noSource: true,
      ext: {
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest('./src/js'))  
});

gulp.task('reload', function(done) {
  browserSync.reload();
  done();
});


// Watch files for changes
gulp.task('watch', function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "src"
    }
  });

  gulp.watch(['./src/**/*.scss' ], gulp.series('styles'));
  gulp.watch(['./src/**/*.html']).on('change', browserSync.reload);
  gulp.watch(['./src/js/*.js', '!./src/js/scripts.min.js'], gulp.series(['scripts', 'reload']));
});

// Default
gulp.task('default', gulp.series('watch'));