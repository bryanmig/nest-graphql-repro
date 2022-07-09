import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import {
  Args,
  Extensions,
  FieldMiddleware,
  GraphQLModule,
  Int,
  MiddlewareContext,
  NextFn,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as assert from 'assert';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorPublic, Post } from './graphqlTypes';

@Resolver(() => AuthorPublic)
export class AuthorsResolver {
  @Query(() => AuthorPublic)
  async author(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Partial<AuthorPublic>> {
    return {
      id: id,
      firstName: 'test',
      lastName: 'ok',
    };
  }

  @ResolveField(() => [Post])
  async posts() {
    return [
      {
        id: 1,
      },
    ];
  }
}

const assertExtensionsMiddleware: FieldMiddleware = (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx;
  const { extensions } = info.parentType.getFields()[info.fieldName];

  assert(
    extensions.test === true,
    `Field ${info.fieldName} is missing extensions`,
  );

  return next();
};

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      buildSchemaOptions: {
        fieldMiddleware: [assertExtensionsMiddleware],
      },
      autoSchemaFile: true,
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthorsResolver],
})
export class AppModule {}
