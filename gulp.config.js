module.exports = function() {
    var client = './src/client/'
    var clientApp = client + 'app/';
    var server = './src/server/';

    var config = {
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
        server : server
    };

    return config;
}