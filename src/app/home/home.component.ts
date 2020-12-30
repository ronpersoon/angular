import {Component, OnInit} from '@angular/core';
import {Store, Select} from '@ngxs/store';
import {BlogPost} from '../app.model';
import {DeleteBlogPost, GetBlogPosts} from '../core/blogpost/blogpost.actions';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AppState} from '../app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Select(AppState.blogPosts) blogPosts$: Observable<BlogPost[]>;

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetBlogPosts());
  }

  createNewBlogPost() {
    this.router.navigate(['/new-blogpost']);
  }

  deleteBlogPost(blogPostId: number) {
    if (confirm(`Are you sure you want to remove this blog post?`)) {
      this.store.dispatch(new DeleteBlogPost(blogPostId));
    }
  }

  editBlogPost(id: number) {
    this.router.navigate(['/new-blogpost', id]);
  }
}
