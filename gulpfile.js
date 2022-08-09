'use strict';

const gulp = require('gulp');
const data = require('gulp-data');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

let version = '';
let app_name = ''

const DIST_DIR = 'dist/guitar-fingerboard';

gulp.task('read_app_meta', function() {
    return gulp.src('./package.json')
    .pipe(data(function(file) {
        var packageJs = JSON.parse(file.contents);
        version = packageJs.version;
        app_name = packageJs.name;
    }))
});

/**
 * Tasks:
 *  - Build an single JS FILE
 */
gulp.task('packJS', function () {
  return gulp.src([
    DIST_DIR + '/main.*.js',
    DIST_DIR + '/polyfills.*.js',
    DIST_DIR + '/runtime.*.js',
  ])
  .pipe(concat(app_name + '.' +version + '.js'))
  .pipe(gulp.dest(DIST_DIR));
});

gulp.task('packCss', function () {
  return gulp.src([
    DIST_DIR + '/styles.*.css',
  ])
  .pipe(concat(app_name + '.' +version + '.css'))
  .pipe(gulp.dest(DIST_DIR));
});


/**
 * Tasks:
 *  - Update index.html with the "single JS FILE name"
 */
gulp.task('allForOneMain', function(){
  return gulp.src([
      DIST_DIR + '/index.html',
    ])
    .pipe(replace(/main.+?js/g, app_name + '.' + version + '.js'))
    .pipe(replace(/es2015-polyfills.+?js/g, ''))
    .pipe(replace(/polyfills.+?js/g, ''))
    .pipe(replace(/vendor.+?js/g, ''))
    .pipe(replace(/runtime.+?js/g, ''))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('default', gulp.series('read_app_meta', 'packJS', 'packCss', 'allForOneMain'));
