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
const imagemin = require("gulp-imagemin");
const svgSprite = require('gulp-svg-sprite');
const	svgmin = require('gulp-svgmin');
const	cheerio = require('gulp-cheerio');
const	replace = require('gulp-replace');

function optimizationImages(){
  return gulp.src("source/static/images/**/*.{gif,png,jpg,svg}","!source/static/sprite/*")
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(gulp.dest("build/static/images/"));
}

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
  return gulp.src("source/static/js/main.js")
    .pipe(gulpPlumber())
    .pipe(sourcemaps.init())
    .pipe(gulpBabel({
        presets: ["@babel/env"],
      }))
    .pipe(gulpUglify())
    .pipe(sourcemaps.write("maps/"))
    .pipe(gulpPlumber.stop())
    .pipe(browserSync.stream())
    .pipe(gulp.dest("build/static/js/"));
}

function optimizationSvg() {
	return gulp.src('source/static/images/sprite/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite.svg"
				}
			}
		}))
		.pipe(gulp.dest('build/static/images/sprite/'));
};

function server() {
  browserSync.init({
    server: {
      baseDir: "build",
    }
  });

  gulp.watch("source/pug/**/*.pug", pugToHtml);
  gulp.watch("source/static/js/**/*.js", script);
  gulp.watch("source/static/styles/**/*.scss", scssToCss);
  gulp.watch("build/*.html").on("change", browserSync.reload);
};

exports.default = gulp.series(clean, pugToHtml, scssToCss, optimizationImages, optimizationSvg, script, server);
