const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');

// ----------- Static server ----------------------
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});
// ----------- / Static server --------------------

// ------ оптимизация и перенос файла sass scss в папку css после его оптимизиции плагинами ---------
gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            basename: "style",
            prefix: "",
            suffix: ".min",
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});
// ------ / оптимизация и перенос файла sass scss в папку css после его оптимизиции плагинами -------

// ----------- перенос html файла из рабочей папки src в папку dist после его оптимизации ----------
gulp.task('html', function() {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist"));
});
// ----------- / перенос html файла из рабочей папки src в папку dist после его оптимизации --------

// // ----------- перенос js файлов из рабочей папки src в папку dist ----------
// gulp.task('scripts', function() {
//     return gulp.src("src/js/**/*.js")
//         .pipe(gulp.dest("dist/js"));
// });
// // ----------- / перенос js файла из рабочей папки src в папку dist ---------

// ----------- перенос fonts файлов из рабочей папки src в папку dist ----------
gulp.task('fonts', function() {
    return gulp.src("src/fonts/**/*.*")
        .pipe(gulp.dest("dist/fonts"));
});
// ----------- / перенос fonts файла из рабочей папки src в папку dist ---------

// ----------- перенос img файлов из рабочей папки src в папку dist ----------
gulp.task('img', function() {
    return gulp.src("src/img/**/*.*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
});
// ----------- / перенос img файла из рабочей папки src в папку dist ---------

// // ----------- перенос mailer файлов из рабочей папки src в папку dist ----------
// gulp.task('mailer', function() {
//     return gulp.src("src/mailer/**/*.*")
//         .pipe(gulp.dest("dist/mailer"));
// });
// // ----------- / перенос mailer файла из рабочей папки src в папку dist ---------

// ---------------- Мнификация и перенос js -------------------
gulp.task('compressjs', async function() {
    gulp.src('src/js/main.js')
      .pipe(minify())
      .pipe(gulp.dest('dist/js'))
});
// ---------------- / Мнификация и перенос js -----------------

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
    gulp.watch("src/**/*.html", gulp.parallel("html"));           // перенос html файла из рабочей папки src в папку dist после его оптимизации плагином htmlmin
    gulp.watch("src/fonts/**/*.*", gulp.parallel("fonts"));
    gulp.watch("src/img/**/*.*", gulp.parallel("img"));
    gulp.watch("src/js/**/*.*", gulp.parallel("compressjs"));

    gulp.watch("src/**/*.html").on("change", browserSync.reload);
    gulp.watch("src/js/**/*.js").on("change", browserSync.reload);
    gulp.watch("src/fonts/**/*.*").on("change", browserSync.reload);
    gulp.watch("src/img/**/*.*").on("change", browserSync.reload);
});

gulp.task('default', gulp.parallel('server', 'watch'));