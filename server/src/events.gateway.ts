import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
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
    // this.logger.log(`Client connected:    ${_client.id}`)
  }

  handleDisconnect(_client: Socket) {
    // this.logger.log(`Client disconnected: ${_client.id}`)
  }

  @SubscribeMessage('room')
  handleRoom(@MessageBody() data: any): void {
    this.logger.log(`${JSON.stringify(data)}`)
    this.wss.emit('room', data)
  }

  @SubscribeMessage('member')
  handleMember(@MessageBody() data: any): void {
    this.wss.emit('member', data)
  }

  @SubscribeMessage('roomMembers')
  handleRoomMembers(@MessageBody() data: roomMemberType[]): WsResponse<roomMemberType[]> {
    return { event: 'roomMembers', data }
  }

  @SubscribeMessage('roomJoin')
  async handleRoomJoin(@MessageBody() data: roomMemberType) {
    const roomMembersCache = await this.getRoomMembersCache()
    const roomMembers = [
      ...roomMembersCache.filter((value) => value.userID !== data.userID),
      { userID: data.userID, cardNumber: data.cardNumber },
    ]
    await this.cacheManager.set('roomMembers', JSON.stringify(roomMembers), { ttl: 1000 })
    this.wss.emit('roomMembers', roomMembers)
  }

  @SubscribeMessage('roomLeave')
  async handleRoomLeave(@MessageBody() data: { userID: string }) {
    const roomMembersCache = await this.getRoomMembersCache()
    const roomMembers = [...roomMembersCache.filter((value) => value.userID !== data.userID)]
    await this.cacheManager.set('roomMembers', JSON.stringify(roomMembers), { ttl: 1000 })
    this.wss.emit('roomMembers', roomMembers)
  }

  private async getRoomMembersCache() {
    let cacheRoomMembers: roomMemberType[] = []
    const cacheRoomMembersRes = await this.cacheManager.get<string>('roomMembers')
    if (cacheRoomMembersRes) {
      cacheRoomMembers = JSON.parse(cacheRoomMembersRes) as roomMemberType[]
    }
    return cacheRoomMembers
  }
}

export type roomMemberType = {
  userID: string
  cardNumber: number | null
}
