let
  gulp = require('gulp'),
  scss = require('gulp-sass'),
  lint = require('gulp-stylelint'),
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  prefix = require('autoprefixer'),
  browserSync = require('browser-sync')

/*scss*/
gulp.task('scss', () =>
  gulp
  .src('app/scss/style.scss')
  .pipe(sourcemaps.init())
  .pipe(scss().on('error', scss.logError))
  .pipe(postcss(
    [
      prefix({
        browsers: ['last 2 versions'],
        cascade: false
      })
    ]
  ))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
);

/*linter*/
gulp.task('lint', () =>
  gulp.src('app/scss/**/*.scss')
  .pipe(lint({
    failAfterError: true,
    reporters: [{
      formatter: 'verbose',
      console: true
    }],
    debug: true
  }))
);

gulp.task('liveserver', () =>
  browserSync.init({
    server: {
      baseDir: "app"
    },
    notify: false
  })
);

gulp.task('watch', ['liveserver'], function() {
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch('app/*.html').on('change', browserSync.reload);
});



gulp.task('default', ['watch']);
