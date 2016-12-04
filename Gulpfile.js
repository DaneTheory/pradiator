var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename');


/*======================================
            Styles Task
=======================================*/
gulp.task('styles', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/assets/css'));
});


/*======================================
            Scripts Task
=======================================*/
gulp.task('scripts',function(){
  gulp.src('')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(''))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(''));
});


/*======================================
            Default Gulp Task
=======================================*/
gulp.task('default', ['styles', 'scripts'], function () {
    gulp.watch("src/scss/*/*.scss", ['styles']);
});
