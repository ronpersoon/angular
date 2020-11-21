import {BlogPost} from '../../app.model';

export class GetBlogPosts {
  static readonly type = '[AppState] Get Blog Posts';
}

export class CreateBlogPost {
  static readonly type = '[AppState] Create Blog Post';

  // constructor(public date: string, public author: string, public id: number, public text: string, public title: string) { }
  constructor(public blogPost: BlogPost) {
  }
}
