import { Extensions, Field, Int, ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => Int)
  @Extensions({
    test: true,
  })
  id: number;
}

@ObjectType()
export class AuthorInternal {
  @Field(() => Int)
  @Extensions({
    test: true,
  })
  id: number;

  @Field({ nullable: true })
  @Extensions({
    test: true,
  })
  firstName?: string;

  @Field({ nullable: true })
  @Extensions({
    test: true,
  })
  lastName?: string;

  @Field(() => [Post])
  @Extensions({
    test: true,
  })
  posts: Post[];
}

@ObjectType()
export class AuthorPublic extends PickType(AuthorInternal, [
  'id',
  'firstName',
  'lastName',
  'posts',
] as const) {}
