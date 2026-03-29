/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CreateTaskDto } from './task.model';
import { TasksService } from './task.service';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Wystapil nieznany blad';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks for current user' })
  @ApiResponse({ status: 200, description: 'Returns all tasks' })
  async findAll(@Req() req) {
    const userId = req.user.id;

    const tasks = await this.tasksService.findAllForUser(userId);

    return {
      success: true,
      count: tasks.length,
      data: tasks,
    };
  }

  @Get('debug/all')
  async debugGetAll() {
    const allTasks = await this.tasksService.getAllTasks();

    return {
      success: true,
      count: allTasks.length,
      data: allTasks,
      warning: 'To jest endpoint debugowy - usuń w produkcji!',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Returns task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string, @Req() req) {
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      throw new BadRequestException('Nieprawidłowe ID taska');
    }

    const task = await this.tasksService.findOne(taskId);

    if (!task) {
      throw new NotFoundException(`Task o ID ${taskId} nie został znaleziony`);
    }

    const userId = req.user.id;
    if (task.createdById !== userId && task.assignedToId !== userId) {
      throw new NotFoundException(`Task o ID ${taskId} nie został znaleziony`);
    }

    return {
      success: true,
      data: task,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.id;

    if (!createTaskDto.title || createTaskDto.title.trim().length === 0) {
      throw new BadRequestException('Tytuł taska jest wymagany');
    }

    if (
      createTaskDto.assignedToId !== undefined &&
      createTaskDto.assignedToId !== null &&
      (typeof createTaskDto.assignedToId !== 'number' ||
        createTaskDto.assignedToId <= 0)
    ) {
      throw new BadRequestException('Nieprawidłowy ID użytkownika');
    }

    if (!['low', 'medium', 'high'].includes(createTaskDto.priority)) {
      throw new BadRequestException('Nieprawidłowy priorytet');
    }

    if (
      !['todo', 'in_progress', 'delayed', 'done'].includes(createTaskDto.status)
    ) {
      throw new BadRequestException('Nieprawidłowy status');
    }

    try {
      const task = await this.tasksService.create(userId, createTaskDto);

      return {
        success: true,
        message: 'Task utworzony pomyślnie',
        data: task,
      };
    } catch (error: unknown) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
    @Req() req,
  ) {
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      throw new BadRequestException('Nieprawidłowe ID taska');
    }

    const existingTask = await this.tasksService.findOne(taskId);
    if (!existingTask) {
      throw new NotFoundException(`Task o ID ${taskId} nie został znaleziony`);
    }

    const userId = req.user.id;
    if (existingTask.createdById !== userId) {
      throw new BadRequestException('Nie masz uprawnień do edycji tego taska');
    }

    if (
      updateTaskDto.title !== undefined &&
      updateTaskDto.title.trim().length === 0
    ) {
      throw new BadRequestException('Tytuł taska nie może być pusty');
    }

    if (
      updateTaskDto.priority &&
      !['low', 'medium', 'high'].includes(updateTaskDto.priority)
    ) {
      throw new BadRequestException('Nieprawidłowy priorytet');
    }

    if (
      updateTaskDto.status &&
      !['todo', 'in_progress', 'delayed', 'done'].includes(updateTaskDto.status)
    ) {
      throw new BadRequestException('Nieprawidłowy status');
    }

    try {
      const updatedTask = await this.tasksService.update(taskId, updateTaskDto);

      return {
        success: true,
        message: 'Task zaktualizowany pomyślnie',
        data: updatedTask,
      };
    } catch (error: unknown) {
      console.error('Blad podczas aktualizacji taska:', getErrorMessage(error));
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      throw new BadRequestException('Nieprawidłowe ID taska');
    }

    const existingTask = await this.tasksService.findOne(taskId);
    if (!existingTask) {
      throw new NotFoundException(`Task o ID ${taskId} nie został znaleziony`);
    }

    const userId = req.user.id;
    if (
      existingTask.createdById !== userId &&
      existingTask.assignedToId !== userId
    ) {
      throw new BadRequestException(
        'Nie masz uprawnień do zmiany statusu tego taska',
      );
    }

    const statusMap: Record<
      string,
      'todo' | 'in_progress' | 'delayed' | 'done'
    > = {
      TODO: 'todo',
      IN_PROGRESS: 'in_progress',
      DELAYED: 'delayed',
      DONE: 'done',
    };

    const upperStatus = status.toUpperCase();
    const newStatus = statusMap[upperStatus];

    if (!newStatus) {
      throw new BadRequestException('Nieprawidłowy status');
    }

    const updatedTask = await this.tasksService.update(taskId, {
      status: newStatus,
    });

    return {
      success: true,
      message: 'Status taska zaktualizowany pomyślnie',
      data: updatedTask,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async delete(@Param('id') id: string, @Req() req) {
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      throw new BadRequestException('Nieprawidłowe ID taska');
    }

    const existingTask = await this.tasksService.findOne(taskId);
    if (!existingTask) {
      throw new NotFoundException(`Task o ID ${taskId} nie został znaleziony`);
    }

    const userId = req.user.id;
    if (existingTask.createdById !== userId) {
      throw new BadRequestException(
        'Nie masz uprawnień do usunięcia tego taska',
      );
    }

    const deleted = await this.tasksService.delete(taskId);

    if (!deleted) {
      throw new NotFoundException(`Nie udało się usunąć taska o ID ${taskId}`);
    }

    return {
      success: true,
      message: 'Task usunięty pomyślnie',
    };
  }
}
