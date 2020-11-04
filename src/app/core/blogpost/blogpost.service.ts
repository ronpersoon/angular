import { Injectable } from '@angular/core';
import {BlogPost} from '../../app.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  constructor() { }

  getBlogPosts(): BlogPost[] {
    return [
      {id: 1, title: 'title1', text: 'text1', author: 'author1', date: '2020/11/04 12:00'},
      {id: 2, title: 'title2', text: 'text2', author: 'author2', date: '2020/11/04 12:00'},
    ];
  }
}
