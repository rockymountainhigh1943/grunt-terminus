/*
 * grunt-terminus
 * 
 * Terminus Docs: https://github.com/pantheon-systems/cli/wiki/Available-Commands
 *
 * Copyright (c) 2015 Jake Love
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('terminus', 'Grunt wrapper for Pantheon CLI Terminus', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      username: '',
      password: '',
      pantheonSiteID: '',
      env: ''
    });

    // Helper function for shorthand
    function sh(cmd) {
      return execSync(cmd, {encoding: 'utf8'});
    }

    function isLoggedIn () {
      var status = sh('terminus auth whoami');
      if (status.search('You are not logged in.') === -1) {
        return true;
      } else {
        return false;
      }
    };

    // console.log('result: ', isLoggedIn());

    // console.log('this.data', this.data);
    // console.log('options', options);
    // console.log('this.files', this.files);
    // console.log('options.env', options.env);
    // console.log('this.data.dest', this.data.dest);

    var dest = this.data.dest;

    function login (){
      sh('terminus auth login ' + options.username + ' --password="' + options.password + '"');
      console.log('Logged in.');
    }

    function listSites (){
      return sh('terminus sites list');
    }

    function backup (){
      if (! isLoggedIn()) {
        console.log('Logging in...');
        login();
      }

      console.log("Starting Backup...");

      var backupMessage = sh('terminus site backup create --element=database --site=' + options.pantheonSiteID + ' --env=' + options.env);

      console.log(backupMessage);
      console.log("Backup Created. Getting Backup...");
  
      var backupGet = sh('terminus site backup get --element=database --site=' + options.pantheonSiteID + ' --env=' + options.env + ' --to-directory=' + dest + ' --latest');
      
      console.log(backupGet);
      console.log("Backup Received!");
    }

    backup();

    // Iterate over all specified file groups.
    // this.files.forEach(function (file) {

      // // Concat specified files.
      // var src = file.src.filter(function (filepath) {
      //   // Warn on and remove invalid source files (if nonull was set).
      //   if (!grunt.file.exists(filepath)) {
      //     grunt.log.warn('Source file "' + filepath + '" not found.');
      //     return false;
      //   } else {
      //     return true;
      //   }
      // }).map(function (filepath) {
      //   // Read file source.
      //   return grunt.file.read(filepath);
      // }).join(grunt.util.normalizelf(options.separator));

      // // Handle options.
      // src += options.punctuation;

      // // Write the destination file.
      // grunt.file.write(file.dest, src);

      // // Print a success message.
      // grunt.log.writeln('File "' + file.dest + '" created.');
    // });
  });

};
