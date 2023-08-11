import gulp from "gulp"
import ts from "gulp-typescript"
import clean from "gulp-clean"
import jsminfy from "gulp-uglify"
import chalk from "chalk"
import merge from "merge2"
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

const FOLDER = "./src"
const OUT_FOLDER = "./dist"
const TS_FILE_PATH = FOLDER + "/**/*.{ts,tsx}"
const SASS_FILE_PATH = FOLDER + "/**/*.{sass,scss}"
const UNHANDLE_PATH = FOLDER + "/**/*.!(*ts|*tsx|sass|scss)"
// ts 配置文件
let tsProject
if (process.env.NODE_ENV === "production") {
  // isolatedModules 打开会导致 .d.ts 文件无法生成
  tsProject = ts.createProject('tsconfig.json', { isolatedModules: false });
} else {
  tsProject = ts.createProject('tsconfig.json');
}

function handlerTs () {
  let tsResult = gulp.src(TS_FILE_PATH).pipe(tsProject())
  if (process.env.NODE_ENV === 'production') {
    // 正式环境中对 dts 进行输出，并对 js 文件进行一个脏压缩处理
    return merge([
      tsResult.dts.pipe(gulp.dest(OUT_FOLDER)),
      tsResult.js.pipe(jsminfy()).pipe(gulp.dest(OUT_FOLDER))
    ]);
  }
  return tsResult.pipe(gulp.dest(OUT_FOLDER))
}

function handleSass () {
  // 要在ECMAScript模块中使用gulp-sas（在更新的Node.js 14及更高版本中支持）
  const sass = gulpSass(dartSass);
  return gulp.src(SASS_FILE_PATH)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(OUT_FOLDER));
}

function handlerNotTsFile () {
  return gulp.src(UNHANDLE_PATH)
    .pipe(gulp.dest(OUT_FOLDER))
}

const cleanFolder = function () {
  return gulp.src(OUT_FOLDER, { allowEmpty: true })
    .pipe(clean())
}

const startWatch = function () {
  // 开发环境下开启监听
  if (process.env.NODE_ENV === 'development') {
    gulp.watch(TS_FILE_PATH, handlerTs)
    gulp.watch(SASS_FILE_PATH, handleSass)
    gulp.watch(UNHANDLE_PATH, handlerNotTsFile)
    console.log(`\n${chalk.bgRed(" watch ")} start watching...\n`);
  } else {
    console.log(`\n${chalk.bgBlue(" success ")} build successful.\n`);
    // 安全退出
    return Promise.resolve()
  }
}

gulp.task('default', gulp.series(cleanFolder, handlerTs, handleSass, handlerNotTsFile, startWatch));
