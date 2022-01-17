import http from 'http'
import socketIO from 'socket.io'

export default function(){
    this.nuxt.hook('render:before',(renderer) => {
        const server = http.createServer(this.nuxt.renderer.app)
        const io = socketIO(server)

        this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(port || 3000, host || 'localhost', resolve))
        //close this server on 'close' event
        this.nuxt.hook('close', ()=> new Promise(server.close))

        // add socket.io events
        const messages = []
        const choices = []
        io.on('connection', (socket) => {
            socket.on('last-messages', function(fn){
                fn(messages.slice(-50))
            })
            socket.on('send-message', function(message){
                messages.push(message)
                socket.broadcast.emit('nex-message', message)
            })
        })
    })
}