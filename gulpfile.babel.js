import gulp from 'gulp';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin'
import changed from 'gulp-changed'
import htmlReplace from 'gulp-html-replace';
import htmlMin from 'gulp-htmlmin';
import del from 'del';
import sequence from 'run-sequence';

// Path variables
const path = {
  dist: 'dist/',
  src: 'src/',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif,svg}',
  htmlin: 'src/*.html',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsoutname: 'script.js',
  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/script.js'
};

// Static Server + watching SCSS/HTML files
gulp.task('serve', ['sass'], () => {
  browserSync.init({
    server: path.src
  });

  gulp.watch([path.htmlin, path.jsin], () => browserSync.reload());
  gulp.watch(path.scssin, ['sass']);
});

// Compile SASS into CSS & auto-inject into browsers
// Parse CSS and add vendor prefixes to CSS rules using values from Can I Use
gulp.task('sass', () =>
  gulp.src(path.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: 'last 2 versions'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.scssout))
    .pipe(browserSync.stream())
);

// Concatenate & minify CSS
gulp.task('css', () =>
  gulp.src(path.cssin)
    .pipe(concat(path.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.cssout))
);

// Concatenate & minify JS
gulp.task('js', () =>
  gulp.src(path.jsin)
    .pipe(concat(path.jsoutname))
    .pipe(uglify())
    .pipe(gulp.dest(path.jsout))
);

// Optimize images
gulp.task('img', () =>
  gulp.src(path.imgin)
    .pipe(changed(path.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(path.imgout))
);

// Concatenate & minify HTML
gulp.task('html', () =>
  gulp.src(path.htmlin)
    .pipe(htmlReplace({
      'css': path.cssreplaceout,
      'js': path.jsreplaceout
    }))
    .pipe(htmlMin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(path.dist))
);

// Delete 'dist' directory
gulp.task('clean', () =>
  del([path.dist])
);

// Build
gulp.task('build', () =>
  sequence('clean', ['html', 'js', 'css', 'img'])
);

// Default Task
gulp.task('default', ['serve']);