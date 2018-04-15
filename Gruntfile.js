module.exports = grunt => {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concat: {
            libsjs : {
                src:
                [
                    'node_modules/jquery/dist/jquery.min.js',
                    'bower_components/progress.js/minified/progress.min.js'
                ],
                dest: 'lib/libs.js'
            }
            // libscss : {
            //         src: 'bower_components/progress.js/minified/progressjs.min.css',
            //         dest: 'lib/css/progressjs.min.css'
            //     }
        },
        copy: {
            vendor: {
              files: [
                  {src:'node_modules/font-awesome/fonts/FontAwesome.otf', dest:'static/vendor/fonts/FontAwesome.otf'},
                  {src:'node_modules/npm-font-open-sans/fonts/Regular/OpenSans-Regular.ttf', dest:'static/vendor/fonts/OpenSans-Regular.ttf'},
                  {src:'node_modules/npm-font-open-sans/fonts/Bold/OpenSans-Bold.ttf', dest:'static/vendor/fonts/OpenSans-Bold.ttf'},
                  {src:'node_modules/npm-font-open-sans/fonts/Italic/OpenSans-Italic.ttf', dest:'static/vendor/fonts/OpenSans-Italic.ttf'},
                  {src:'node_modules/jquery/dist/jquery.min.js', dest:'static/vendor/js/jquery.min.js'},
                  {src:'node_modules/raphael/raphael.js',dest:'static/vendor/js/raphael.js'},
              ]
            },
            dist: {
                files: [
                    {expand: true, src: ['js/**'], dest: 'dist/'},
                    {expand: true, src: ['css/**'], dest: 'dist/'},
                    {expand: true, src: ['fonts/**'], dest: 'dist/'},
                    {expand: true, src: ['lib/**'], dest: 'dist/'},
                    {expand: true, src: ['images/**'], dest: 'dist/'},
                    {src:'proxy.php', dest:'dist/proxy.php'},
                    {src:'sdo.html', dest:'dist/sdo.html'},
                    {src:'README.md', dest:'dist/README.md'},
                    {src:'LICENSE', dest:'dist/LICENSE'}
                ]
            }
        }
    });

    // Default task(s).
    grunt.registerTask('dist', 'copy:dist');
    grunt.registerTask('concat:libs', ['concat:libsjs']);
    grunt.registerTask('default', ['concat:libs','dist']);
};
