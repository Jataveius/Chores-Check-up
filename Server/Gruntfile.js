// add grunt into the prameter
module.exports = function(grunt) {

  grunt.initConfig({
    // uglify - minification
    uglify: {
      my_target: {
        //Make sure the Angular syntax works or set mangle to false. This is going require that extra array for the dependancies you inject.
        options: {
         mangle: false
       },
        files: {
          // destination of where the min.js file will go : [target which file will get minification]
          'server/public/assets/scripts/controllers/admin.controller.min.js': ['client/scripts/controllers/admin.controller.js'],
          'server/public/assets/scripts/controllers/adminbank.controller.min.js': ['client/scripts/controllers/adminbank.controller.js'],
          'server/public/assets/scripts/controllers/bank.controller.min.js': ['client/scripts/controllers/bank.controller.js'],
          'server/public/assets/scripts/controllers/bonusrewards.controller.min.js': ['client/scripts/controllers/bonusrewards.controller.js'],
          'server/public/assets/scripts/controllers/checklist.controller.min.js': ['client/scripts/controllers/checklist.controller.js'],
          'server/public/assets/scripts/controllers/funstuff.controller.min.js': ['client/scripts/controllers/funstuff.controller.js'],
          'server/public/assets/scripts/controllers/login.controller.min.js': ['client/scripts/controllers/login.controller.js'],
          'server/public/assets/scripts/controllers/user.booklog.controller.min.js': ['client/scripts/controllers/user.booklog.controller.js'],
          'server/public/assets/scripts/controllers/user.controller.min.js': ['client/scripts/controllers/user.controller.js'],
          'server/public/assets/scripts/services/bank.service.min.js': ['client/scripts/services/bank.service.js'],
          'server/public/assets/scripts/services/book.service.min.js': ['client/scripts/services/book.service.js'],
          'server/public/assets/scripts/services/tasks.service.min.js': ['client/scripts/services/tasks.service.js'],
          'server/public/assets/scripts/clientapp.min.js': ['client/scripts/clientapp.js'],
        }//end files
      }//end my_target
    },//end uglify
    // watch - watch files for changes and run tasks on them, watch the client file and run uglify

    // copy - copy our vendor files
    copy: {
      main: {
        files: [
          //current working directory
          {expand: true, cwd: 'node_modules', src: ['bootstrap/**', 'angular/**'], dest: 'server/public/vendors'}
        ]
      }
    }
  });//end grunt initConfig

// must load the task via npm install
// $: npm install grunt-contrib-<name of task go here> --save-dev
// to add the files in terminal type
// $: grunt uglify
// $: grunt watch
// $: grunt copy
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');


//grunt register tasks
// now instead of typing in the terminal $: grunt uglify..etc just need to type $: grunt
grunt.registerTask('default', ['uglify','copy']);
};//end of modules
