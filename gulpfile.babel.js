/**
* Import necessary plugins
*/
import gulp from 'gulp';
import sass from 'gulp-sass';
import browser from 'browser-sync';
import htmlMin from 'gulp-htmlmin';
import cssMin from 'gulp-clean-css';
import imgMin from 'gulp-imagemin';
import jsMin from 'gulp-uglify';
import seq from 'run-sequence';
import babel from 'gulp-babel';

/**
* Object map of paths for use with tasks
*/
const paths = {
  js: './src/**/*.js',
  // images: './images/**/*',
  html: '*.html',
  css: './src/scss/**/*.scss',
  src: 'src/',
  dest: '_build/'
};

// bootstrap src
const bootstrap = {
  src: './node_modules/bootstrap-sass/'
};

const fonts = {
  src: `${bootstrap.src}/assets/fonts/**/*`,
  dest: `${paths.dest}/assets/fonts/`
};

const sassObj = {
  src: `${paths.src}/scss/**/*.scss`,
  dest: `${paths.dest}/assets/css/`,
  sassOpts: {
    outputStyle: 'nested',
    precison: 3,
    errLogToConsole: true,
    includePaths: [bootstrap.src + 'assets/stylesheets']
  }
};




// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
  return gulp.src(fonts.src)
    .pipe(gulp.dest(fonts.dest));
});

/**
* compile/minify css files
*/
gulp.task('sass', ['fonts'], () => {
  return gulp.src(sassObj.src)
    .pipe(sass(sassObj.sassOpts))
    .pipe(cssMin())
    .pipe(gulp.dest(sassObj.dest))
    .pipe(browser.reload({
      stream: true
    }));
});

/**
* minify html but compiles css first
*/
gulp.task('html', ['sass'], () => {
  return gulp.src(paths.html)
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest(`${paths.dest}/`));
});

/**
* minify images
*/
// gulp.task('images', () => {
//   return gulp.src(paths.images)
//     .pipe(imgMin())
//     .pipe(gulp.dest(`${paths.dest}/images`));
// });

/**
* compile and minify JS (even though there isn't any)
*/
gulp.task('babel', () => {
  return gulp.src(paths.js)
    .pipe(babel())
    .pipe(jsMin())
    .pipe(gulp.dest(`${paths.dest}/js`));
});


/**
* watch js, html, scss files for changes
* compiles/minifies all on any change
*/
gulp.task('watch', ['serve'], () => {
  gulp.watch(paths.css, ['sass', browser.reload]);
  gulp.watch(paths.html, ['html', browser.reload]);
  gulp.watch(paths.js, ['babel', browser.reload]);
});


/**
* serve on port 3000 from base directory dist/
* also exposes node_modules to dist so nothing will break :)
*/
gulp.task('serve', () => {
  browser({
    port: process.env.PORT || 8000,
    ghostMode: false,
    open: false,
    server: {
      baseDir: `${paths.dest}`,
      routes : {
        './node_modules': './node_modules'
      }
    }
  });
});


/*
* uses run-sequence to run every task in order
*/
gulp.task('build', () => {
  return seq('sass', 'html', 'babel', 'watch');
});


/*
* default task -- calls the build command
*/
gulp.task('default', (done) => {
  seq('build', done);
});