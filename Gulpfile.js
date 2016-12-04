var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    changed = require('gulp-changed'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin');

var reload = browserSync.reload;

function onError(err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};


/*======================================
            Styles Task
=======================================*/
gulp.task('styles', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init({ debug: true }))
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 4 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/assets/css'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.reload({stream:true}));
});


/*======================================
            Scripts Task
=======================================*/
gulp.task('scripts', function(){
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
            Images Task
=======================================*/
gulp.task('images', function(){
  return gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('app/assets/img'))
    .pipe(cache(imagemin({
        progressive: true,
        interlaced: true,
        svgoPlugins: [
            { removeViewBox: false },
            { removeUselessStrokeAndFill: false },
        ]
    })))
  .pipe(rename({ suffix: '-opti' }))
  .pipe(gulp.dest('app/assets/img'));
});


/*======================================
            Browser Sync Task
=======================================*/
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "localhost:8787",
        port: 8777,

        notify: true,
        logPrefix: 'PRadiator',
        logLevel: 'debug', // logLevel options, from most to least verbose:
                           // ==> trace, debug, warn, info, error, silent
        logConnections: true,
        logFileChanges: true,
        online: true,
        open: true,
        reloadOnRestart: false,
        scrollProportionally: true,
        injectChanges: true,
        timestamps: true,

        notify: {
          styles: {
              top: 'auto',
              bottom: '0',
              padding: '1em',
              position: 'fixed',
              fontSize: '1.2em',
              fontFamily: 'monospace',
              zIndex: '9999999',
              borderRadius: '0.4em 0em 0em 0em',
              color: 'rgba(244, 244, 244, 1)',
              textAlign: 'center',
              display: 'block',
              backgroundColor: 'rgba(200, 50, 93, 0.8)'
          }
        },
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});


/*======================================
            Nodemon Task
=======================================*/
gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: './server.js',
    debug: true,            // If true, enable debug mode
    stdout: true,           // If true, logs will be HIGHLY verbose
    env: { 'DEBUG': '*' },  // Sets server env to development
    ignore: [
      'Gulpfile.js',
      'node_modules/'
    ],
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
  }, 500);
  })
  .on('error', (err) => {
    throw err;
  })
});


/*======================================
            Default Gulp Task
=======================================*/
gulp.task('default', ['styles', 'scripts', 'browser-sync'], function () {
    gulp.watch("src/scss/*/*.scss", ['styles']);
    gulp.watch("src/js/*.js", ['scripts']);
    gulp.watch("app/*.html", ['bs-reload']);
});
