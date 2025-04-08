import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Task | null> {
    return this.repo.findOneBy({ id });
  }
  

  create(task: Partial<Task>): Promise<Task> {
    return this.repo.save(task);
  }

  update(id: number, task: Partial<Task>): Promise<any> {
    return this.repo.update(id, task);
  }

  delete(id: number): Promise<any> {
    return this.repo.delete(id);
  }

  search(query: string): Promise<Task[]> {
    return this.repo
      .createQueryBuilder('task')
      .where('task.title ILIKE :q OR task.description ILIKE :q', { q: `%${query}%` })
      .getMany();
  }

  filter(isDone: boolean): Promise<Task[]> {
    return this.repo.find({ where: { isDone } });
  }
}
