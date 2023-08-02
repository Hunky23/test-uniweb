/* Импорт библиотек */
import _gulp from 'gulp';
const {src, dest, watch, series, parallel} = _gulp;
import {deleteAsync} from 'del';
import * as sass from 'sass';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpBabel from  'gulp-babel';
import gulpCssmin from  'gulp-cssmin';
import gulpFonter from 'gulp-fonter';
import gulpLivereload from 'gulp-livereload';
import gulpMinify from 'gulp-minify';
import gulpPlumber from 'gulp-plumber';
import gulpRename from 'gulp-rename';
import _gulpSass from 'gulp-sass';
const gulpSass = _gulpSass(sass);
import gulpTtf2woff2 from 'gulp-ttf2woff2';

/* Пути проекта */
const path = {
    src: './src',
    build: './www'
};
path.del = [
    path.build + '*'
];

/* Задачи для очистки */
function clean() {
    return deleteAsync(path.del);
}

/* Задача для php файлов */
function template() {
    return src(path.src + '/**/*.+(html|php)', {
        dot: true,
        nodir: true
    })
        .pipe(gulpPlumber())
        .pipe(dest(path.build))
        .pipe(gulpLivereload());
}

/* Задача для стилей */
function style() {
    return src(path.src + '/**/!(_)*.scss', {
        dot: true,
        nodir: true
    })
        .pipe(gulpPlumber())
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(src(path.src + '/**/!(*.min|*.map).css', {
            dot: true,
            nodir: true
        }))
        .pipe(gulpAutoprefixer())
        .pipe(dest(path.build + '/'))
        .pipe(gulpCssmin())
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(src(path.src + '/**/(*.min.css|*.map.css)', {
            dot: true,
            nodir: true
        }))
        .pipe(dest(path.build + '/'))
        .pipe(gulpLivereload());
}

/* Задача для скриптов */
function script() {
    return src([
        path.src + '/**/*.js',
        '!' + path.src + '/**/*.min.js',
        '!' + path.src + '/**/*.min.js.map'
    ], {
        dot: true,
        nodir: true
    })
        .pipe(gulpPlumber())
        .pipe(gulpBabel({
            presets: ['@babel/env']
        }))
        .pipe(dest(path.build + '/'))
        .pipe(gulpMinify({
            ext: {
                min:'.js'
            },
            noSource: true
        }))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(src([
            path.src + '/**/*.min.js',
            path.src + '/**/*.min.js.map'
        ], {
            dot: true,
            nodir: true
        }))
        .pipe(dest(path.build + '/'))
        .pipe(gulpLivereload());
}

/* Задача для картинок */
function image() {
    return src(path.src + '/**/*.+(jpg|jpeg|png|bmp|svg|gif|ico)', {
        dot: true,
        nodir: true
    })
        .pipe(gulpPlumber())
        .pipe(dest(path.build + '/'))
        .pipe(gulpLivereload());
}

/* Задачи для шрифтов */
function font() {
    return src(path.src + '/**/*.+(ttf|woff|woff2)', {
        dot: true,
        nodir: true
    })
        .pipe(gulpPlumber())
        .pipe(gulpFonter({
            formats: ['ttf', 'woff']
        }))
        .pipe(gulpTtf2woff2({
            clone: true
        }))
        .pipe(dest(path.build + '/'))
        .pipe(gulpLivereload());
}

/* Задачи для шрифтов */
function other() {
    return src(path.src + '/**/*.htaccess', {
        dot: true,
        nodir: true
    })
        .pipe(dest(path.build + '/'))
        .pipe(gulpLivereload());
}

/* Задачи для слежения */
function watcher() {
    watch(path.src + '/**/*.+(html|php)', template);
    watch(path.src + '/**/*.+(scss|css)', {usePolling: true}, style);
    watch(path.src + '/**/*.+(js|.min.js|.min.js.map)', script);
    watch(path.src + '/**/*.+(jpg|jpeg|png|bmp|svg|gif|ico)', image);
    watch(path.src + '/**/*.+(ttf|woff|woff2)', font);

    gulpLivereload.listen({quiet: true});
}

/* Экспорт задач */
const _default = series(clean, parallel(template, style, script, image, font, other), watcher);

export {_default as default, clean}