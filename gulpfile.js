'use strict';

const del = require('del');
const pug = require('gulp-pug');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const webpack = require('webpack');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const autoprefixer = require('autoprefixer');
const webpackStream = require('webpack-stream');
const postcssEasyImport = require('postcss-easy-import');

const paths = {
  html: {
    src: ['./src/pages/*.pug'],
    dist: './dist/',
    watch: [
      './src/blocks/**/*.pug',
      './src/pages/**/*.pug',
      './src/layouts/**/*.pug',
    ],
  },
  css: {
    src: ['./src/css/main.css'],
    dist: './dist/css',
    watch: ['./src/blocks/**/*.css', './src/css/*.css'],
  },
  assets: {
    src: ['./src/assets/**/*'],
    dist: './dist/assets',
    watch: ['./src/assets/**/*'],
  },
};

gulp.task('clean', (cb) => {
  del.sync('dist');

  cb();
});

gulp.task('html', (cd) => {
  return gulp
    .src(paths.html.src)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest(paths.html.dist))
    .pipe(browserSync.stream());
});

gulp.task('css', (cd) => {
  return gulp
    .src(paths.css.src)
    .pipe(postcss([postcssEasyImport()]))
    .pipe(gulp.dest(paths.css.dist))
    .pipe(browserSync.stream());
});

gulp.task('css:build', (cd) => {
  return gulp
    .src(paths.css.src)
    .pipe(postcss([postcssEasyImport(), autoprefixer()]))
    .pipe(
      cleanCSS({
        level: {
          1: {
            specialComments: 0,
          },
        },
      })
    )
    .pipe(gulp.dest(paths.css.dist))
    .pipe(browserSync.stream());
});


gulp.task('assets', () => {
  return gulp
    .src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dist))
    .pipe(browserSync.stream());
});

gulp.task('serve', () => {
  browserSync.init({
    server: './dist/',
    port: 4000,
    notify: true,
  });

  gulp.watch(paths.html.watch, gulp.parallel('html'));
  gulp.watch(paths.css.watch, gulp.parallel('css'));
  gulp.watch(paths.assets.watch, gulp.parallel('assets'));
});

gulp.task(
  'build',
  gulp.series('clean', 'html', 'css:build', 'assets')
);

gulp.task(
  'default',
  gulp.series('clean', 'html', 'css', 'assets', 'serve')
);
