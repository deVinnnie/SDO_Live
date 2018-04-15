module.exports = function(grunt) {
    // Project configuration.
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

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('dist', 'copy:dist');
    grunt.registerTask('concat:libs', ['concat:libsjs']);
    grunt.registerTask('default', ['concat:libs','dist']);
};
