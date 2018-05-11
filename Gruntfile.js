const webpackConfig = require('./webpack.config.js');

module.exports = grunt => {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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
        },
        babel: {
          options: {
            sourceMap: true
          },
          files: {
            expand: true,
            src: "static/js/*.js",
            //ext: "-compiled.js",
            dest: "dist/"
          }
        },
        webpack: {
          options: {
            stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
          },
          build: Object.assign({ watch: false }, webpackConfig)
        }
    });

    // Default task(s).
    grunt.registerTask('dist', 'copy:dist');
    grunt.registerTask('concat:libs', ['concat:libsjs']);
    grunt.registerTask('default', ['babel', 'webpack:build']);//, 'concat:libs']); /*,'dist']);*/
}
