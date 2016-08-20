(function() {
    'use strict';

    angular.module('app.timecard', [
        'timecard.basedate.modal',
        'timecard.punchoclock.modal',
        'app.timecard.details'
    ]);
})();