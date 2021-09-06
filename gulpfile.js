const gulp = require("gulp");
const gulpPug = require("gulp-pug");
const gulpPlumber = require("gulp-plumber");
const gulpSass = require("gulp-sass")(require("sass"));

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
      .pipe(gulpPlumber.stop())
      .pipe(gulp.dest("build/static/css/"));
  }

exports.default = gulp.series(pugToHtml, scssToCss);
