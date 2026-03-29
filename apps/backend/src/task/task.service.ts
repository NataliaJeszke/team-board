/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { CreateTaskDto, Task } from './task.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private currentId = 1;

  constructor(private usersService: UsersService) {}

  async create(
    createdById: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const creator = await this.usersService.findById(createdById);

    if (!creator) {
      throw new Error(`Użytkownik tworzący o ID ${createdById} nie istnieje`);
    }

    let assignedToName: string | undefined = undefined;

    if (createTaskDto.assignedToId) {
      const assignee = await this.usersService.findById(
        createTaskDto.assignedToId,
      );

      if (!assignee) {
        throw new Error(
          `Użytkownik przypisany o ID ${createTaskDto.assignedToId} nie istnieje`,
        );
      }

      assignedToName = assignee.name;
    }

    const task: Task = {
      id: this.currentId++,
      title: createTaskDto.title,
      priority: createTaskDto.priority,
      status: createTaskDto.status,
      createdById,
      createdByName: creator.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(createTaskDto.assignedToId && {
        assignedToId: createTaskDto.assignedToId,
        assignedToName,
      }),
    };

    this.tasks.push(task);

    return task;
  }

  async findAllForUser(userId: number): Promise<Task[]> {
    const userTasks = this.tasks.filter(
      (task) => task.createdById === userId || task.assignedToId === userId,
    );

    return userTasks;
  }

  async findOne(id: number): Promise<Task | undefined> {
    return this.tasks.find((task) => task.id === id);
  }

  async update(
    id: number,
    updateTaskDto: Partial<CreateTaskDto>,
  ): Promise<Task | undefined> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return undefined;

    const task = this.tasks[taskIndex];

    if (
      updateTaskDto.assignedToId &&
      updateTaskDto.assignedToId !== task.assignedToId
    ) {
      const assignee = await this.usersService.findById(
        updateTaskDto.assignedToId,
      );
      if (assignee) {
        task.assignedToName = assignee.name;
      }
    }

    this.tasks[taskIndex] = {
      ...task,
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    return this.tasks[taskIndex];
  }

  async delete(id: number): Promise<boolean> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.tasks;
  }
}
