module.exports = function(gulp, plugins) {
    return function() {

        gulp.src('.tmp/index.html')
            .pipe(plugins.removeCode({
                production: true
            }))
            .pipe(gulp.dest('dist'))
    };
};
