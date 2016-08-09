var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var config = require( './gulp.config' )();

/**
 * List the available gulp tasks
 */
gulp.task( 'help', $.taskListing );
gulp.task( 'default', [ 'help' ] );

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task( 'wiredep', function() {
  log( 'Wiring the bower dependencies into the html' );

  var wiredep = require( 'wiredep' ).stream;
  var options = {
      bowerJson : require('./bower.json'),
      directory : './bower_components/',
      ignorePath : '../..'
  };

  return gulp
    .src( config.index )
    .pipe( wiredep( options ) )
    .pipe( inject( config.js, '', config.jsOrder ) )
    .pipe( gulp.dest( config.client ) );
});

gulp.task('inject', [ 'wiredep' /**, 'templatecache' **/ ], function() {
  log('Wire up css into the html, after files are ready');

  return gulp
    .src( config.index )
    .pipe( inject( config.css ) )
    .pipe( gulp.dest( config.client ) );
});

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject( src, label, order ) {
  var options = { read: false };
  if ( label ) {
    options.name = 'inject:' + label;
  }

  return $.inject( orderSrc( src, order ), options );
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc( src, order ) {
  //order = order || ['**/*'];
  return gulp
    .src( src )
    .pipe( $.if( order, $.order( order ) ) );
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log( msg ) {
  if ( typeof ( msg ) === 'object' ) {
    for ( var item in msg ) {
      if ( msg.hasOwnProperty( item ) ) {
        $.util.log( $.util.colors.blue( msg[ item ] ) );
      }
    }
  } else {
    $.util.log( $.util.colors.blue( msg ) );
  }
}

module.exports = gulp;