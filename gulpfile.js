// Gulp tasks

// Load plugins
var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnext = require('cssnext'),
    minifycss = require('gulp-minify-css'),
    imports = require('postcss-import'),
    vars = require('postcss-simple-vars'),
    nesting = require('postcss-nested'),
    mixins = require('postcss-mixins'),
    calc = require('postcss-calc'),
    colors = require('postcss-color-function'),
    customMedia = require('postcss-custom-media'),
    normalize = require('postcss-normalize'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    processors = [
      normalize,
      imports,
      mixins,
      vars,
      calc,
      customMedia,
      nesting,
      colors,
      autoprefixer({browsers: ['last 3 versions']})
    ];

gulp.task('styles', function() {
  return gulp.src('dev_assets/css/main.css')
  .pipe(postcss(processors))
  .pipe(rename('main.css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss({advanced: false, keepSpecialComments: 0}))
  .pipe(gulp.dest('assets/css'));
})

// concatenate and minify javascript
gulp.task('scripts', function() {
  return gulp.src(['dev_assets/js/*.js'])
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

// compress and copy images
gulp.task('images', function () {
  return gulp.src('dev_assets/img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('assets/img'));
});

// clean up assets folder
gulp.task('clean', function(cb) {
  del(['assets/css', 'assets/js', 'assets/img'], cb)
});

// build task to populate the assets folder
gulp.task('build', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
});

// build files and watch for changes
gulp.task('watch', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
  gulp.watch('dev_assets/css/*', ['styles']);
  gulp.watch('dev_assets/js/*', ['scripts']);
  gulp.watch('dev_assets/img/*', ['images']);
});

// default task - calls build
gulp.task('default', ['build']);
