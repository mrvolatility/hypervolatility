var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cp = require('child_process');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/* Build the Jekyll Site */
gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ['build'], {
      stdio: 'inherit'
    })
    .on('close', done);
});

/* Rebuild Jekyll & do page reload */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

/* Wait for jekyll-build, then launch the Server */
gulp.task('browser-sync', ['sass', 'js-work', 'jekyll-build'], function () {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

/* Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds) */
gulp.task('sass', function () {
  return gulp.src('_scss/main.scss')
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    //.pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('css'));
});

/* My JS task */
gulp.task('js-work', function () {
  gulp.src('_js/*.js')
    .pipe(concat('app.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('_site/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('js'));
});

/* Watch scss files for changes & recompile // Watch html/md files, run jekyll & reload BrowserSync */
gulp.task('watch', function () {
  gulp.watch('_scss/*.scss', ['sass']);
  gulp.watch('_js/*.js', ['js-work']);
  gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

/* Default task, running just `gulp` will compile the sass, compile the jekyll site, launch BrowserSync & watch files. */
gulp.task('default', ['browser-sync', 'watch']);

//gulp.task("deploy", ["jekyll-build"], function () {
//    return gulp.src("./_site/**/*")
//    .pipe(deploy());
//});