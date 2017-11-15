module.exports = function(grunt) {
var sassStyle = 'expanded';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      output : {
        options: {
          style: sassStyle
        },
        files: {
          './dist/layout.css': './src/layout.css'
        }
      }
    },
    concat: {
	  options: {
        separator: ';'
      },
      dist: {
        src: ['./src/**/*.js'],
        dest: './dist/<%=pkg.name%>.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          './dist/<%= pkg.name %>.min.js': ['./dist/<%=pkg.name%>.js']
        }
      }
    },
    jshint: {
      files: ['./src/**/*.js'],
	  options: {
        //这里是覆盖JSHint默认配置的选项
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true		  
        },
		laxcomma:true
      }
    },
    watch: {
      scripts: {
        files: ['./src/layout3.js','./src/layout4.js'],
        tasks: ['jshint','concat','uglify']
      },
      sass: {
        files: ['./src/layout.css'],
        tasks: ['sass']
      },
      livereload: {
          options: {
              livereload: '<%= connect.options.livereload %>'
          },
          files: [
              'demo_layout3.html', 'demo_layout4.html',
              './src/layout.css',
              'js/layout3.js', 'js/layout4.js'
          ]
      }
    },
    connect: {
      options: {
          port: 9000,
          open: true,
          livereload: 35729,
          // Change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost'
      },
      server: {
        options: {
          port: 9001,
          base: './'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('outputcss',['sass']);
  grunt.registerTask('concatjs',['concat']);
  grunt.registerTask('compressjs',['jshint','concat','uglify']);
  grunt.registerTask('watchit',['sass','jshint','concat','uglify','connect','watch']);
  grunt.registerTask('default');
};