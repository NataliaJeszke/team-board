import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [UsersModule],
})
export class TasksModule {}
