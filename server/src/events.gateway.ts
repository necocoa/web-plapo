import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Cache } from 'cache-manager'
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  private logger = new Logger('AppGateway')

  afterInit() {
    this.logger.log('Initialized!')
  }

  handleConnection(_client: Socket, ..._args: any[]) {
    // this.logger.log(`Client connected:    ${client.id}`)
  }

  handleDisconnect(_client: Socket) {
    // this.logger.log(`Client disconnected: ${client.id}`)
  }

  // WsResponse<string>

  @SubscribeMessage('room')
  handleRoom(@MessageBody() data: any): void {
    this.logger.log(`${JSON.stringify(data)}`)
    this.wss.emit('room', data)
  }

  @SubscribeMessage('member')
  handleMember(@MessageBody() data: any): void {
    this.wss.emit('member', data)
  }

  @SubscribeMessage('cache')
  handleCache(@MessageBody() data: any): void {
    const handle = async () => {
      const cacheRes = await this.cacheManager.get<string>('member')
      let cacheData = {}
      if (cacheRes) {
        cacheData = JSON.parse(cacheRes)
      }
      const setData = { ...cacheData, ...data }
      console.info(setData)
      const setDataStr = JSON.stringify(setData)
      await this.cacheManager.set('member', setDataStr, { ttl: 1000 })
      this.wss.emit('cache', setData)
    }
    handle()
  }
}
