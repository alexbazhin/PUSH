var lr = require('tiny-lr'), // Минивебсервер для livereload
    gulp = require('gulp'), // Сообственно Gulp JS
    jade = require('gulp-jade'), // Плагин для Jade
    stylus = require('gulp-stylus'), // Плагин для Stylus
    livereload = require('gulp-livereload'), // Livereload для Gulp
    myth = require('gulp-myth'), // Плагин для Myth - http://www.myth.io/
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    connect = require('connect'), // Webserver
    server = lr();

gulp.task('stylus', function() {
    gulp.src('./src/index.styl')
        .pipe(stylus({
            use: ['nib']
        })) // собираем stylus
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(myth()) // добавляем префиксы - http://www.myth.io/
        .pipe(gulp.dest('./public/css/')) // записываем css
        .pipe(livereload(server)); // даем команду на перезагрузку css
});

gulp.task('jade', function() {
    gulp.src('./src/index.jade')
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
        .pipe(gulp.dest('./public/')) // Записываем собранные файлы
        .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

gulp.task('js', function() {
    gulp.src('./src/js/**')        
        .pipe(gulp.dest('./public/js'))
        .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

gulp.task('images', function() {
    gulp.src('./src/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))
});

gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./public'))
        .listen('8000');

    console.log('Server listening on http://localhost:8000');
});

gulp.task('watch', function() {
    // Предварительная сборка проекта
    gulp.run('stylus');
    gulp.run('jade');
    gulp.run('images');
    gulp.run('js');    

    // Подключаем Livereload
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('src/index.styl', function() {
            gulp.run('stylus');
        });
        gulp.watch('src/index.jade', function() {
            gulp.run('jade');
        });
        gulp.watch('src/images/**/*', function() {
            gulp.run('images');
        });
        gulp.watch('src/js/**', function() {
            gulp.run('js');
        });                
    });
    gulp.run('http-server');
});
