import { Hocuspocus } from '@hocuspocus/server'
import { SQLite } from '@hocuspocus/extension-sqlite'

const server = new Hocuspocus({
  port: 1234,
  address: '127.0.0.1',

  async onConnect() {
    console.log('👤 Client connected')
  },

  async onDisconnect() {
    console.log('👋 Client disconnected')
  },

  async onAuthenticate() {
    // This is where you could authenticate users
    return {
      status: 'ok',
    }
  },

  async onChange() {
    console.log('📝 Document changed')
  },

  extensions: [
    new SQLite({
      database: 'db.sqlite',
    }),
  ],
});

console.log('🚀 Starting Hocuspocus server...')
server.listen(); 