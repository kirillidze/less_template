/* eslint-disable arrow-body-style */
const gulp = require("gulp"),
    less = require("gulp-less"),
    browserSync = require("browser-sync"),
    babel = require("gulp-babel"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglifyjs"),
    cssnano = require("gulp-cssnano"),
    htmlmin = require("gulp-html-minifier"),
    rename = require("gulp-rename"),
    autoprefixer = require("gulp-autoprefixer"),
    del = require("del"),
    imagemin = require("gulp-imagemin"),
    pngquant = require("imagemin-pngquant"),
    webpack = require("webpack"),
    webpackStream = require("webpack-stream"),
    webpackConfig = require("./webpack.config.js");

gulp.task("less", () => {
    return gulp
        .src(["app/less/*.less", "!app/less/_*.less"])
        .pipe(less())
        .pipe(gulp.dest("app/css"));
});

gulp.task("css", () => {
    return gulp.src("app/css/*.css").pipe(
        browserSync.reload({
            stream: true
        })
    );
});

gulp.task("code", () => {
    return gulp.src("app/*.html").pipe(
        browserSync.reload({
            stream: true
        })
    );
});

gulp.task("scripts", () => {
    return gulp
        .src("app/js/app.js")
        .pipe(
            webpackStream(webpackConfig),
            webpack
        )
        .pipe(gulp.dest("./app/js"))
        .pipe(
            browserSync.reload({
                stream: true
            })
        );
});

gulp.task("browser-sync", () => {
    return browserSync({
        server: {
            baseDir: "app"
        },
        notify: false
    });
});

gulp.task("watch", () => {
    gulp.watch("app/less/*.less", gulp.parallel("less"));
    gulp.watch("app/css/*.css", gulp.parallel("css"));
    gulp.watch("app/*.html", gulp.parallel("code"));
    gulp.watch(["app/js/*.js", "!app/js/bundle.js"], gulp.parallel("scripts"));
});

gulp.task("dev", gulp.parallel("scripts", "watch", "browser-sync", "less"));

function clean() {
    return del("dist");
}

function img() {
    return gulp
        .src("app/img/**/*")
        .pipe(
            imagemin({
                interlaced: true,
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                use: [pngquant()]
            })
        )
        .pipe(gulp.dest("./dist/img"));
}

function buildCss() {
    return gulp
        .src("app/css/*.css")
        .pipe(autoprefixer(["last 15 versions", ">1%", "ie 7", "ie 8"], { cascade: true }))
        .pipe(cssnano())
        .pipe(gulp.dest("./dist/css"));
}

function buildJs() {
    return gulp
        .src("app/js/bundle.js")
        .pipe(
            babel({
                presets: ["@babel/env"]
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
}

function buildHTML() {
    return gulp
        .src("app/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist"));
}

function buildFonts() {
    return gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));
}

const build = gulp.series(clean, gulp.parallel(buildCss, buildJs, buildHTML, buildFonts, img));
gulp.task("build", build);
