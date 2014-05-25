
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

require('shelljs/global');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');

module.exports = function(grunt) {

  grunt.registerTask(
    'payloads',
    'Copy the /dev payloads into /dist for production.',
    function() {

      // Glob all of the /dev directories.
      var devs = glob.sync(
        path.resolve(__dirname, '../views/**/dev')
      );

      _.each(devs, function(dev) {

        // Get the corresponding /dist.
        var dist = path.dirname(dev) + '/dist';

        // Make /dev the new /dist.
        rm('-rf', dist); mkdir(dist);
        cp('-r', dev+'/**', dist);

      });

    });

};