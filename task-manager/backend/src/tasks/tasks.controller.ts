import { Controller, Get, Post, Put, Delete, Query, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  getAll(@Query('status') status: string) {
    if (status === 'done') return this.service.filter(true);
    if (status === 'undone') return this.service.filter(false);
    return this.service.findAll();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.service.search(query);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() task: Partial<Task>) {
    return this.service.create(task);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() task: Partial<Task>) {
    return this.service.update(id, task);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
