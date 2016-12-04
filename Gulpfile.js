var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
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
  gulp.src('src/scripts/scripts.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/js'));
});


/*======================================
            Default Gulp Task
=======================================*/
gulp.task('default', ['styles', 'scripts'], function () {
    gulp.watch("src/scss/*/*.scss", ['styles']);
    gulp.watch("src/js/*.js", ['scripts']);
});
