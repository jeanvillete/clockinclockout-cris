var gulp = require( 'gulp' );
var $ = require( 'gulp-load-plugins' )( { lazy: true } );
var config = require( './gulp.config' )();
var del = require( 'del' );

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

gulp.task( 'inject', [ 'wiredep', 'templatecache' ], function() {
  log('Wire up css into the html, after files are ready');

  return gulp
    .src( config.index )
    .pipe( inject( config.css ) )
    .pipe( gulp.dest( config.client ) );
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task( 'serve-dev', [ 'inject' ], function() {
  var nodeOptions = {
      script : config.server + 'app.js',
      delayTime : 1,
      watch : [ config.server ]
  };

  return $.nodemon( nodeOptions )
    .on('start', function() {
      log('*** nodemon started');
    })
    .on('crash', function() {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function() {
      log('*** nodemon exited cleanly');
    });
});

/**
 * Build everything
 * This is separate, optimize before handling image or fonts
 */
gulp.task( 'build', [ 'optimize', 'fonts' ], function( done ) {
  log('Building everything');

  var msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the build folder',
    message: 'Running `gulp serve-build`'
  };
  del( config.temp );
  log( msg );
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task( 'optimize', [ 'inject' ], function( done ) {
  log( 'Optimizing the js, css, and html' );

  var notIndexFilter = $.filter( ['**/*', '!**/index.html'], { restore: true } );
  var templateCache = config.temp + config.templateCache.file;

  return gulp
    .src( config.index )
    .pipe( $.plumber() )
    .pipe( inject( templateCache, 'templates' ) )
    .pipe( $.useref( { searchPath: './' } ) )
    .pipe( $.if( '**/*.css', $.minifyCss() ) )
    .pipe( $.if( '**/' + config.optimized.app, $.ngAnnotate( { add: true } ) ) )
    .pipe( $.if( '**/' + config.optimized.app, $.uglify() ) )
    .pipe( $.if( '**/' + config.optimized.lib, $.uglify() ) )
    .pipe( notIndexFilter )
    .pipe( $.rev() )
    .pipe( notIndexFilter.restore )
    .pipe( $.revReplace() )
    .pipe( gulp.dest( config.build ) );
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task( 'templatecache', [ 'clean-code' ], function( done ) {
  log( 'Creating an AngularJS $templateCache' );

  return gulp
    .src( config.htmltemplates )
    .pipe( $.bytediff.start() )
    .pipe( $.minifyHtml( { empty: true } ) )
    .pipe( $.bytediff.stop( bytediffFormatter ) )
    .pipe( $.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe( gulp.dest( config.temp ) );
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task( 'clean-code', function( done ) {
  log( 'cleaning code' );

  var files = [].concat(
    config.temp + '**/*.js',
    config.build + 'js/**/*.js',
    config.build + '**/*.html'
  );

  return gulp
    .src( files )
    .pipe( $.deleteFile() );
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task( 'fonts', [ 'clean-fonts' ], function( done ) {
  log( 'Copying fonts' );
  console.log( config.fonts );
  return gulp
    .src( config.fonts )
    .pipe( gulp.dest( config.build + 'fonts' ) );
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task( 'clean-fonts', function( done ) {
  return gulp
    .src( config.build + 'fonts/**/*.*' )
    .pipe( $.deleteFile() );
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

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter( data ) {
  var difference = ( data.savings > 0) ? ' smaller.' : ' larger.';
  return data.fileName + ' went from ' +
    ( data.startSize / 1000 ).toFixed( 2 ) + ' kB to ' +
    ( data.endSize / 1000 ).toFixed( 2 ) + ' kB and is ' +
    formatPercent( 1 - data.percent, 2 ) + '%' + difference;
}

function formatPercent(num, precision) {
  return ( num * 100 ).toFixed( precision );
}

module.exports = gulp;