const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

// const todoProto = grpc.load('todo.proto')
const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})

// const todoProto = (grpc.loadPackageDefinition(
//     packageDefinition
// ) as unknown) as ProtoGrpcType;

const todoProto = grpc.loadPackageDefinition(packageDefinition);
var todo = todoProto.TodoService

const server = new grpc.Server();

const todos = [
    {
        id: '1', title: 'Todo', content: 'Content of Todo 1'
    }, {
        id: '2', title: 'Todo', content: 'Content of Todo 2'
    }, {
        id: '3', title: 'Todo', content: 'Content of Todo 3'
    }, {
        id: '4', title: 'Todo', content: 'Content of Todo 4'
    }
]

server.addService(todo.service, {
    listTodos: (call, callback) => {
        callback(null, {
            todos: todos
        });
    },
    createTodo: (call, callback) => {
        let incomingNewTodo = call.request
        todos.push(incomingNewTodo)
        console.log('createTodo',todos)
        callback(null, incomingNewTodo)
    },
    getTodo: (call, callback) => {
        let incomingTodoRequest = call.request
        let todoId = incomingTodoRequest.id;
        const response = todos.filter((todo)=>todo.id == todoId)

        if(response.length > 0) {
            callback(null, response)
        } else {
            callback({
                message: 'Todo not found'
            },  null)
        }
    }
})

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server Started')
    server.start()
});