import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {BlogPost} from '../app.model';
import {DeleteBlogPost, GetBlogPosts} from '../core/blogpost/blogpost.actions';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  blogPosts: BlogPost[];

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetBlogPosts()).subscribe((response) => {
      this.blogPosts = response.app.blogPosts;
    });
  }

  createNewBlogPost() {
    this.router.navigate(['/new-blogpost']);
  }

  deleteBlogPost(blogPostId: number) {
    this.store.dispatch(new DeleteBlogPost(blogPostId)).subscribe((response) => {
      this.blogPosts = response.app.blogPosts;
    });
  }
}
