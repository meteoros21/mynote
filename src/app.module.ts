import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration';
import { User } from 'src/user.entity'
import { UserModule } from './user.module';
import { CategoryModule } from './category.module';
import { Category } from './category.entity';
import { Note } from './note.entity';
import { NoteModule } from './note.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration]
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [User, Category, Note], // 여기에 사용할 모든 엔티티를 나열합니다.
        synchronize: false, // 개발 환경에서만 사용. 실제 환경에서는 비활성화하세요. 
        // true이면 entity와 데이터베이스가 동기화 되어 데이터베이스 구조가 변할 수 있다.
      }),
    }),

    UserModule,
    CategoryModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule]
})

export class AppModule {}
