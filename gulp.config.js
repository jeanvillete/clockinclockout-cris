module.exports = function() {
    var client = './src/client/'
    var clientApp = client + 'app/';
    var server = './src/server/';
    var bowerDirectory = './bower_components/';

    var config = {
        fonts : [
            bowerDirectory + 'font-awesome/fonts/**/*.*',
            bowerDirectory + 'bootstrap/fonts/**/*.*'
        ],
        images : client + 'images/**/*.*',
        htmltemplates : clientApp + '**/*.html',
        temp : './.tmp/',
        build : './build/',
        client : client,
        clientApp : clientApp,
        index : client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        css : client + 'styles/styles.css',
        server : server,
        templateCache : {
            file : 'templates.js',
            options : {
                module : 'app.core',
                root : 'app/',
                standalone : false
            }
        },
        optimized : {
            app : 'app.js',
            lib : 'lib.js'
        }
    };

    return config;
}