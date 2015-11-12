var gulp = require('gulp');
var shell = require('gulp-shell');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// Task for building blog when something changed:
gulp.task('build',shell.task(['jekyll build --watch']));

// Task for serving blog with Browsersync
gulp.task('serve', function () {
    browserSync.init({server: {baseDir: '_site/'}});
    gulp.watch(['js/*.js', '!js/main.min.js']).on('change', function () {
         gulp.src(['js/*.js', '!js/main.min.js'])
         .pipe(jshint({reporter: 'default'}))
         .pipe(concat('main.min.js'))
         .pipe(gulp.dest('./js/'));
    });

    gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', ['build', 'serve']);