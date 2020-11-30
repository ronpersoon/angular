import {BlogPost} from '../../app.model';

export class GetBlogPosts {
  static readonly type = '[AppState] Get Blog Posts';
}

export class CreateBlogPost {
  static readonly type = '[AppState] Create Blog Post';

  constructor(public blogPost: BlogPost) {
  }
}

export class DeleteBlogPost {
  static readonly type = '[AppState] Delete Blog Post';

  constructor(public blogPostId: number) {
  }
}
