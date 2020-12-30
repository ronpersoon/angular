import {Component, OnInit, ViewChild} from '@angular/core';
import {CreateBlogPost} from '../../core/blogpost/blogpost.actions';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {get} from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {filter, pluck, switchMap} from 'rxjs/operators';
import {BlogPost} from '../../app.model';
import {BlogPostService} from '../../core/blogpost/blogpost.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-new-blogpost',
  templateUrl: './new-blogpost.component.html',
  styleUrls: ['./new-blogpost.component.scss']
})
export class NewBlogpostComponent implements OnInit {

  @ViewChild('blogPostId') blogPostId;
  @ViewChild('blogPostTitle') blogPostTitle;
  @ViewChild('blogPostText') blogPostText;
  @ViewChild('blogPostAuthor') blogPostAuthor;
  @ViewChild('blogPostDate') blogPostDate;

  mode: string;
  blogPost: BlogPost;
  originalBlogPost: string;
  date = new FormControl(new Date());

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private blogPostService: BlogPostService) {
  }

  ngOnInit(): void {

    this.initBlogPost();

    this.mode = get(this.route, 'routeConfig.data.mode', 'edit');

    this.route.params
      .pipe(
        pluck('blogPostId'),
        filter(blogPostId => !!blogPostId),
        switchMap((blogPostId: string) => this.blogPostService.getBlogPost(+blogPostId)),
      ).subscribe((details) => {
        this.blogPost = details as BlogPost;
        this.date = new FormControl(new Date(this.blogPost.date));
        this.originalBlogPost = JSON.parse(JSON.stringify(details));
      });
  }

  initBlogPost() {
    this.blogPost = {
      id: 0,
      title: '',
      text: '',
      author: '',
      date: ''
    };
  }

  saveBlogPost() {
    this.blogPost = {
      id: Math.floor(Math.random() * 9999999) + 1,
      title: this.blogPostTitle.nativeElement.value,
      text: this.blogPostText.nativeElement.value,
      author: this.blogPostAuthor.nativeElement.value,
      date: this.blogPostDate.nativeElement.value
    };

    if (this.mode === 'add') {
      this.store.dispatch(new CreateBlogPost(this.blogPost)).subscribe(() => {
        this.returnToRoot();
      });
    } else {
      // this.store.dispatch(new UpdateBlogPost(this.blogPost)).subscribe(() => {
      //   this.returnToRoot();
      // });
    }
  }

  returnToRoot() {
    this.router.navigate(['']);
  }
}
