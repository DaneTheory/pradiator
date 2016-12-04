var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync');

var reload = browserSync.reload;


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
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.reload({stream:true}));
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
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});


/*======================================
            Browser Sync Task
=======================================*/
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: "localhost:8787",
        port: 8777,
        notify: true
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});


/*======================================
            Default Gulp Task
=======================================*/
gulp.task('default', ['styles', 'scripts', 'browser-sync'], function () {
    gulp.watch("src/scss/*/*.scss", ['styles']);
    gulp.watch("src/js/*.js", ['scripts']);
    gulp.watch("app/*.html", ['bs-reload']);
});
