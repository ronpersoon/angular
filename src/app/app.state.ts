import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {BlogPost} from './app.model';
import {tap} from 'rxjs/operators';
import {BlogPostService} from './core/blogpost/blogpost.service';
import {CreateBlogPost, DeleteBlogPost, GetBlogPosts} from './core/blogpost/blogpost.actions';

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

  @Selector()
  static blogPosts(state: AppStateModel) {
    return state.blogPosts;
  }

  constructor(
    private blogPostService: BlogPostService
  ) {
  }

  @Action(GetBlogPosts)
  getBlogPosts({patchState}: StateContext<AppStateModel>) {
    return this.blogPostService.getBlogPosts().pipe(tap(blogPosts => patchState({blogPosts})));
  }

  @Action(CreateBlogPost)
  createBlogPost(ctx: StateContext<AppStateModel>, blogPost: BlogPost) {
    return this.blogPostService.createBlogPost(blogPost).pipe(tap(result => {

      const newBlogPost = result.blogPost;
      const currentPosts = ctx.getState().blogPosts;
      ctx.patchState({
        blogPosts: [
          ...currentPosts,
          newBlogPost
        ]
      });
    }));
  }

  @Action(DeleteBlogPost)
  deleteBlogPost(ctx: StateContext<AppStateModel>, blogPostId: number) {
    return this.blogPostService.deleteBlogPost(blogPostId).pipe(tap(result => {

      const currentPosts = ctx.getState().blogPosts;
      const updatedPosts = currentPosts.filter(({id}) => id !== result.blogPostId);

      ctx.patchState({
        blogPosts: [
          ...updatedPosts
        ]
      });

      return updatedPosts;
    }));
  }
}
