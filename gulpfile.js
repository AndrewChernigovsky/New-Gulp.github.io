const gulp = require('gulp');
const gulpPug = require('gulp-pug');

function pugToHtml() {
    return gulp.src('source/pug/pages/*.pug')
    .pipe(gulpPug())
    .pipe(gulp.dest('build'));
  }
  
  exports.default = gulp.series(pugToHtml);