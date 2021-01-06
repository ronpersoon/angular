import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {BlogPost} from './app.model';
import {tap} from 'rxjs/operators';
import {BlogPostService} from './core/blogpost/blogpost.service';
import {CreateBlogPost, DeleteBlogPost, GetBlogPosts, UpdateBlogPost} from './core/blogpost/blogpost.actions';
import { SetUnsavedChanges } from './app.actions';
import {Navigate} from '@ngxs/router-plugin';

export interface AppStateModel {
  blogPosts: BlogPost[];
  unsavedChanges: boolean;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    blogPosts: [],
    unsavedChanges: false
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
      const existingBlogPosts = ctx.getState().blogPosts;
      ctx.patchState({
        blogPosts: [
          ...existingBlogPosts,
          newBlogPost
        ]
      });
      ctx.dispatch(new SetUnsavedChanges(false));
      ctx.dispatch(new Navigate(['']));
    }));
  }

  @Action(UpdateBlogPost)
  updateBlogPost(ctx: StateContext<AppStateModel>, blogPost: BlogPost) {
    return this.blogPostService.updateBlogPost(blogPost).pipe(tap(result => {

      const updatedBlogPost = result.blogPost;
      const existingBlogPosts = ctx.getState().blogPosts;

      ctx.patchState({
        blogPosts: existingBlogPosts.map(b => b.id === updatedBlogPost.id ? updatedBlogPost : b),
      });
      ctx.dispatch(new SetUnsavedChanges(false));
      ctx.dispatch(new Navigate(['']));
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
    }));
  }

  @Action(SetUnsavedChanges)
  setUnsavedChanges({ patchState }: StateContext<AppStateModel>, { unsavedChanges }: SetUnsavedChanges) {
    return patchState({ unsavedChanges });
  }
}
