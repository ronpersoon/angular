import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {BlogPost} from './app.model';
import {tap} from 'rxjs/operators';
import {BlogPostService} from './core/blogpost/blogpost.service';
import {GetBlogPosts} from './core/blogpost/blogpost.actions';

export interface AppStateModel {
  blogPosts: BlogPost[];
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    blogPosts: []
  }
})

@Injectable()
export class AppState {

  @Selector() static blogPosts(state: AppStateModel) { return state.blogPosts; }

  constructor(
    private blogPostService: BlogPostService
  ) {}

  @Action(GetBlogPosts)
  getBlogPosts({ patchState }: StateContext<AppStateModel>) {
    return this.blogPostService.getBlogPosts().pipe(tap(blogPosts => patchState({ blogPosts })));
  }
}
