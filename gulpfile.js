let gulp=require('gulp');
let sass=require('gulp-sass');
let uglify=require('gulp-uglify');
let autoprefixer=require('gulp-autoprefixer');

let tsify=require('tsify');
let source=require('vinyl-source-stream');
let browserify=require('browserify');
let vinylBuffer=require('vinyl-buffer');


let paths={
    ts:{
        scr:'./assets/ts/*.ts',
        dest:'./dist/assets/js/',
        entries:['./assets/ts/index.ts']
    },
    sass:{
        scr:'./assets/sass/*.sass',
        dest:'./dist/assets/css/'
    },
    pages:{
        scr:'./*.html',
        dest:'./dist/'
    },
    images:{
        scr:'./assets/images/*.*',
        dest:'./dist/assets/images/'
    }
};

let tsOptions={
    "target": "es3",
    "sourceMap": false,
    "alwaysStrict": true,
    "moduleResolution": "node",
    "noImplictyAny":true
};

function copyPages() {
    return gulp.src(paths.pages.scr)
        .pipe(gulp.dest(paths.pages.dest))
}

function copyImages() {
    return gulp.src(paths.images.scr)
        .pipe(gulp.dest(paths.images.dest))
}

function sassTask(){
    return gulp.src(paths.sass.scr)
        .pipe(sass({includePaths:['node_modules']}))
        .pipe(autoprefixer({cascade:true}))
        .pipe(gulp.dest(paths.sass.dest))
}

function jsBundler() {
    return browserify({
        entries:paths.ts.entries,
        basedir:'.',
        cache:{},
        packageCache:{}
    })
}

function tsTask() {
    return jsBundler()
        .plugin(tsify,tsOptions)
        .bundle()
        .pipe(source('app-bundle.js'))
        .pipe(vinylBuffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.ts.dest))
}

function watch(){
    //watch changes
    gulp.watch([paths.sass.scr],sassTask);
    gulp.watch([paths.ts.scr],tsTask);
    gulp.watch([paths.images.scr],copyImages);
    gulp.watch([paths.pages.scr],copyPages);
}


exports.default=gulp.parallel(watch,sassTask,tsTask,copyPages,copyImages);

