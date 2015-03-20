/*!
 * gulp
 */
 
// Load plugins
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    ngmin = require("gulp-ngmin"); 
    imagemin = require('gulp-imagemin'),
    htmlreplace = require('gulp-html-replace'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    notify = require('gulp-notify'),
    del = require('del');
 
// Output
var outputFolder = '../dist/';

// Styles
gulp.task('styles', function() {
  return gulp.src(['css/main.less'])
    .pipe(less())
    .pipe(concat('main.css'))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(outputFolder+'styles'));
});
 
 
gulp.task('html-replace', function() {
  gulp.src(['src/index.html','src/mentions.html'])
    .pipe(htmlreplace({
        'css': 'styles/main.min.css',
        'js': 'scripts/main.js'
    }))
    .pipe(gulp.dest(outputFolder));
});

// Images
gulp.task('images', function() {
  return gulp.src(['src/images/*','src/images/projects/*'], {base: 'src/images'})
    // .pipe(imagemin({  optimizationLevel: 7, 
    //                         progressive: true, 
    //                         interlaced: true ,
    //                         use : [optipng(), jpegtran()]
    // }))
    .pipe(gulp.dest(outputFolder+'images'));
});

// Other files
gulp.task('copy-other-files', function() {
  return gulp.src(['app/partials/**','app/scribbles/**','app/js/**'], {
            base: 'src'
        }).pipe(gulp.dest(outputFolder));
});
 
// Clean
gulp.task('clean', function() {
    del(outputFolder)
});
 
// Default task
gulp.task('default', ['styles', 'scripts', 'html-replace','images','copy-other-files']);
 
// Watch
gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/images/**/*', ['images']);
});