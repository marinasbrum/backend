import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [TasksModule, ProdutosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
