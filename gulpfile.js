var gulp = require('gulp'),
nodemon = require('gulp-nodemon'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
csso = require('gulp-csso'),
htmlmin = require('gulp-htmlmin');

gulp.task('start', function() {
  nodemon({
    script: 'http.js',
  }).on('start');
});

gulp.task('minify', function() {
  gulp.src('dev/html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public/html/'));
  gulp.src('dev/css/*.css')
    .pipe(csso())
    .pipe(gulp.dest('public/css/'));
  gulp.src('dev/images/home/*')
    .pipe(imagemin({
      multipass: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('public/images/home/'));
  gulp.src('dev/images/board/*')
    .pipe(imagemin({
      multipass: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('public/images/board/'));
  gulp.src('dev/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('default', ['minify'], function() {
  nodemon({
    script: 'http.js',
  }).on('start');
});