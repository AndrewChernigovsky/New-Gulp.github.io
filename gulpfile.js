const gulp = require("gulp");
const gulpPug = require("gulp-pug");
const gulpPlumber = require("gulp-plumber");
const gulpSass = require("gulp-sass")(require("sass"));
const gulpAutoprefixer = require("gulp-autoprefixer");
const gulpCssMinify = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const gulpBabel = require("gulp-babel");
const gulpUglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();

function clean() {
  return del("build");
}

function pugToHtml() {
  return gulp
    .src("source/pug/pages/*.pug")
    .pipe(gulpPlumber())
    .pipe(
      gulpPug({
        pretty: true,
      })
    )
    .pipe(gulpPlumber.stop())
    .pipe(gulp.dest("build"));
}

function scssToCss() {
  return gulp
    .src("source/static/styles/style.scss")
    .pipe(gulpPlumber())
    .pipe(gulpSass())
    .pipe(gulpAutoprefixer())
    .pipe(gulpCssMinify({level: 2}))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("maps/"))
    .pipe(gulpPlumber.stop())
    .pipe(browserSync.stream())
    .pipe(gulp.dest("build/static/css/"));
}

function script() {
  return gulp
    .src("source/static/js/main.js")
    .pipe(gulpPlumber())
    .pipe(sourcemaps.init())
    .pipe(
      gulpBabel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulpUglify())
    .pipe(sourcemaps.write("maps/"))
    .pipe(gulpPlumber.stop())
    .pipe(gulp.dest("build/static/js/"));
}

function server() {
  browserSync.init({
    server: {
      baseDir: "build",
    },
  });

  gulp.watch("source/pug/**/*.pug", pugToHtml);
  gulp.watch("source/static/styles/**/*.scss", scssToCss);
  gulp.watch("build/*.html").on("change", browserSync.reload);
};

exports.default = gulp.series(clean, pugToHtml, scssToCss, script, server);
