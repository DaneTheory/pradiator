var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano');


/*======================================
            Styles Task
=======================================*/
gulp.task('styles', function () {
    return gulp.src('')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest(''))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(''));
});

/*======================================
            Default Gulp Task
=======================================*/
gulp.task('default', ['styles'], function () {
    console.log('Gulp Default Task Is Running!');
});
