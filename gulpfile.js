'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    camelize: true
});
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync'); //ブラウザをリロード
var browserify = require('browserify');　//node.js の書き方ができるようになる
var seq = require('run-sequence').use(gulp);　//並列でタスクを実行
var watch = require('gulp-watch');
var rimraf = require('rimraf');　//フォルダ消す

var opt = {
    dirRoot: './src',
    appJs: '/scripts/main.js',
    style:'/styles/main.scss',
    dirDest: 'dist',
};


// Styles
gulp.task('sass', function() {
    return $.rubySass(opt.dirRoot + opt.style)
        .on('error', function (err) {
            console.error('Error!', err.message)
         })
        .pipe($.plumber())
        .pipe($.pleeease({
          autoprefixer: {
              browsers: ['last 5 versions']
          },
          minifier: false
        }))
        .pipe(gulp.dest(opt.dirDest))
        .pipe($.notify({
            message: 'Styles task complete'
        }));
});

// Html
gulp.task('html', function() {
    return gulp.src(opt.dirRoot + '/{,**/}*.html')
        .pipe($.plumber())
        .pipe(gulp.dest(opt.dirDest));
});

gulp.task('clean-tmpdir', function(cb) {
  rimraf(opt.dirDest, cb);
});
gulp.task('clean-distdir', function(cb) {
  rimraf(opt.dirDest, cb);
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: [opt.dirDest],
        },
        notify: false,
        stream: true
    });
    var reload = browserSync.reload;
    var dirRoot = opt.dirRoot;
    watch([dirRoot + '/**/*.html'], function(event) {
        seq('html', reload);
    });
    watch([dirRoot + '/**/*.scss'], function(event) {
        seq('sass', reload);
    });
});

gulp.task('default', function(cb) {
    seq('clean-tmpdir', ['sass', 'html',], 'watch', cb);
});