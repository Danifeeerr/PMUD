/*jshint esversion: 6 */
const jsonrpc = require('node-json-rpc');
const task_model = require('./task_model.js');

const host = 'localhost', port = 3005;

const server = new jsonrpc.Server({ host, port });

// Método para manejar llamadas a métodos inexistentes
server.addMethod('NotFound', function (params, callback) {
    console.log('Method does not exist. Params:', params);
    callback(null, 'Method does not exist');
});

// ======= Métodos CRUD =======

server.addMethod('count', function (params, callback) {
    console.log("Method call params for 'count':", params);
    const where = (params && params[0]) || {};
    task_model.count(where)
        .then(total => callback(null, total))
        .catch(err => callback(err, null));
});

server.addMethod('getAll', function (params, callback) {
    console.log("Method call params for 'getAll':", params);
    const where = (params && params[0]) || {};
    const order = (params && params[1]) || {};
    const offset = (params && params[2]) || 0;
    const limit = (params && params[3]) || 0;
    task_model.getAll(where, order, offset, limit)
        .then(tasks => callback(null, tasks))
        .catch(err => callback(err, null));
});

server.addMethod('get', function (params, callback) {
    console.log("Method call params for 'get':", params);
    task_model.get(params[0])
        .then(task => callback(null, task))
        .catch(err => callback(err, null));
});

server.addMethod('add', function (params, callback) {
    console.log("Method call params for 'add':", params);
    task_model.add(params[0], params[1])
        .then(() => callback(null, "Task added"))
        .catch(err => callback(err, null));
});

server.addMethod('update', function (params, callback) {
    console.log("Method call params for 'update':", params);
    task_model.update(params[0], params[1], params[2])
        .then(() => callback(null, "Task updated"))
        .catch(err => callback(err, null));
});

server.addMethod('delete', function (params, callback) {
    console.log("Method call params for 'delete':", params);
    task_model.delete(params[0])
        .then(() => callback(null, "Task deleted"))
        .catch(err => callback(err, null));
});

server.addMethod('reset', function (params, callback) {
    console.log("Method call params for 'reset':", params);
    task_model.reset()
        .then(() => callback(null, "Task reset"))
        .catch(err => callback(err, null));
});

// ======= Métodos del sistema =======

server.addMethod('system.listMethods', function (params, callback) {
    console.log("Method call params for 'system.listMethods':", params);
    callback(null, ['count', 'getAll', 'get', 'add', 'update', 'delete', 'reset']);
});

server.addMethod('system.methodHelp', function (params, callback) {
    console.log("Method call params for 'system.methodHelp':", params);
    const method = (params && params[0]) || '';
    let help = 'Unknown method';
    switch (method) {
        case 'system.listMethods': help = "List of available methods"; break;
        case 'system.methodHelp': help = "Gives help for a method"; break;
        case 'system.methodSignature': help = "Gives the signature of a method"; break;
        case 'count': help = "Returns the number of elements matching the conditions (where)"; break;
        case 'getAll': help = "Returns an array of elements matching conditions, with offset and limit"; break;
        case 'get': help = "Returns the element identified by id"; break;
        case 'add': help = "Adds a new element"; break;
        case 'update': help = "Updates the element identified by id"; break;
        case 'delete': help = "Deletes the element identified by id"; break;
        case 'reset': help = "Resets the element list to initial values"; break;
    }
    callback(null, help);
});

server.addMethod('system.methodSignature', function (params, callback) {
    console.log("Method call params for 'system.methodSignature':", params);
    const method = (params && params[0]) || '';
    let sign = 'Unknown method';
    switch (method) {
        case 'system.listMethods': sign = "None"; break;
        case 'system.methodHelp': sign = "Name of the method"; break;
        case 'system.methodSignature': sign = "Name of the method"; break;
        case 'count':
            sign = `where: Object with filter conditions. Example: {a:3, b:['<',5], c:['includes','A']}`;
            break;
        case 'getAll':
            sign = `where: filter object; order: sorting object; offset: number; limit: number`;
            break;
        case 'get': sign = "id: element identification"; break;
        case 'add': sign = "title: string, done: boolean"; break;
        case 'update': sign = "id, title, done"; break;
        case 'delete': sign = "id"; break;
        case 'reset': sign = "None"; break;
    }
    callback(null, sign);
});

// ======= Arranca el servidor =======
server.start(function (error) {
    if (error) throw error;
    console.log(`JSON-RPC server listening on http://${host}:${port}`);
});
