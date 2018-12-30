https://code.visualstudio.com/docs/languages/css

npm i gulp-cli -g
npm i -g gulp
npm i -g node-sass less
cd project
npm init
npm i gulp -D
npm i gulp-less -D
npm i browser-sync -D
npm i --save-dev gulp-babel @babel/core @babel/preset-env
npm i gulp-concat -D //�����������
npm i gulp-uglifyjs -D
npm i gulp-cssnano -D
npm i gulp-html-minifier -D
npm i gulp-rename -D //�����������
npm i --save-dev gulp-autoprefixer
npm i gulp-imagemin imagemin-pngquant -D
npm i del -D

������� � ����� ������� ���� gulpfile.js:

let gulp = require("gulp"),
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
    pngquant = require("imagemin-pngquant");

gulp.task("less", function() {
    return gulp
        .src(["app/less/*.less", "!app/less/_*.less"])
        .pipe(less())
        .pipe(autoprefixer(["last 15 versions", ">1%", "ie 7", "ie 8"], { cascade: true }))
        .pipe(gulp.dest("app/css"))
        .pipe(
            browserSync.reload({
                stream: true
            })
        );
});

gulp.task("code", function() {
    return gulp.src("app/*.html").pipe(
        browserSync.reload({
            stream: true
        })
    );
});

gulp.task("scripts", function() {
    return gulp.src("app/js/*.js").pipe(
        browserSync.reload({
            stream: true
        })
    );
});

gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "app"
        },
        notify: false
    });
});

gulp.task("watch", function() {
    gulp.watch("app/less/*.less", gulp.parallel("less"));
    gulp.watch("app/*.html", gulp.parallel("code"));
    gulp.watch("app/js/*.js", gulp.parallel("scripts"));
});

gulp.task("dev", gulp.parallel("watch", "browser-sync", "less"));

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
        .pipe(cssnano())
        .pipe(gulp.dest("./dist/css"));
}

function buildJs() {
    return gulp
        .src("app/js/*.js")
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

var build = gulp.series(clean, gulp.parallel(buildCss, buildJs, buildHTML, buildFonts, img));
gulp.task("build", build);


�������:
gulp dev - ����������
gulp build - ������ ��������