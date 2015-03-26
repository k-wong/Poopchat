angular.module('ListServices', ['ngResource']).
factory('ListItems', function($resource) {
    return $resource(
        '/backlift/data/:listid/:id',  // URL template
        {id: '@id'},                    // default values
        {
            create: {method: 'POST'},
            update: {method: 'PUT'}
        }
    );
});

angular.module('UserServices', ['ngResource']).
factory('UserList', function($resource) {
    return $resource(
        '/backlift/data/users/:id',  // URL template
        {id: '@id'},                 // default values
        {
            create: {method: 'POST'},
            update: {method: 'PUT'}
        }
    );
});