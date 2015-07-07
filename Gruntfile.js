module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        concat: {
            libs: {
                src:
                [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/progress.js/minified/progress.min.js'
                ],
                dest: 'lib/libs.js'
            }
        },
        copy: {
            dist: {
                files: [
                    {expand: true, src: ['js/**'], dest: 'dist/'},
                    {expand: true, src: ['css/**'], dest: 'dist/'},
                    {expand: true, src: ['fonts/**'], dest: 'dist/'},
                    {expand: true, src: ['libs/**'], dest: 'dist/'},
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
    grunt.registerTask('default', 'dist');
};
