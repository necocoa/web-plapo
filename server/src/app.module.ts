import { CacheModule, Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EventsGateway } from './events.gateway'

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
