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

  @SubscribeMessage('roomMemberUpdate')
  handleRoomMemberUpdate(@MessageBody() data: roomMemberType) {
    this.wss.emit('roomMemberUpdate', data)
  }

  @SubscribeMessage('roomMemberNameUpdate')
  handleRoomMemberNameUpdate(@MessageBody() data: roomMemberType) {
    this.wss.emit('roomMemberNameUpdate', data)
  }

  @SubscribeMessage('cardPick')
  handleCardPick(@MessageBody() data: roomMemberType) {
    this.wss.emit('cardPick', data)
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
      { userID: data.userID, cardNum: data.cardNum },
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
  name: string | null
  cardNum: number | null
}
