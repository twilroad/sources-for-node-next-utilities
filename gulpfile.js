const gulp = require("gulp");
const sequence = require("gulp-sequence");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("@notadd/gulp-typescript");
const tslint = require("gulp-tslint");

const packages = {
    "gulp-typescript": ts.createProject("src/gulp-typescript/tsconfig.json"),
    "open-in-browser": ts.createProject("src/open-in-browser/tsconfig.json"),
    "webpack-plugins": ts.createProject("src/webpack-plugins/tsconfig.json"),
};

const source = "src";
const distId = process.argv.indexOf("--dist");
const dist = distId < 0 ? "node_modules/@notadd" : process.argv[distId + 1];

const modules = Object.keys(packages);

gulp.task("default", function () {
    tasks();
});

modules.forEach(module => {
    gulp.task(module, () => {
        return packages[module]
            .src()
            .pipe(tslint({
                formatter: "verbose",
            }))
            .pipe(tslint.report({
                emitError: false,
                summarizeFailureOutput: true,
            }))
            .pipe(sourcemaps.init())
            .pipe(packages[module]())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(`${dist}/${module}`));
    });
});

gulp.task("build", function (cb) {
    sequence("open-in-browser", modules.filter((module) => module !== "open-in-browser"), cb);
});

function tasks() {
    modules.forEach(module => {
        watchTypescript(source, module);
    });
}

function watchTypescript(source, module) {
    gulp.watch(
        [
            `${source}/${module}/**/*.ts`,
            `${source}/${module}/**/*.tsx`,
            `${source}/${module}/*.ts`,
            `${source}/${module}/*.tsx`,
        ],
        [
            module,
        ]
    ).on("change", function (event) {
        console.log("File " + event.path + " was " + event.type + ", running tasks...");
    });
}
