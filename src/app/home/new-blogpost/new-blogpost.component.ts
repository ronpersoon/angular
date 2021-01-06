import {Component, OnInit, ViewChild} from '@angular/core';
import {CreateBlogPost, UpdateBlogPost} from '../../core/blogpost/blogpost.actions';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {get} from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {filter, pluck, switchMap} from 'rxjs/operators';
import {BlogPost} from '../../app.model';
import {BlogPostService} from '../../core/blogpost/blogpost.service';
import {SetUnsavedChanges} from '../../app.actions';

@Component({
  selector: 'app-new-blogpost',
  templateUrl: './new-blogpost.component.html',
  styleUrls: ['./new-blogpost.component.scss']
})
export class NewBlogpostComponent implements OnInit {

  mode: string;
  originalBlogPost: BlogPost;
  hasUnsavedChanges = false;
  pickerDate = new Date();

  blogPost: BlogPost = {
    id: Math.floor(Math.random() * 9999999) + 1,
    title: null,
    text: null,
    author: null,
    date: this.getDateString(new Date())
  };

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private blogPostService: BlogPostService) {
  }

  ngOnInit(): void {

    this.mode = get(this.route, 'routeConfig.data.mode', 'edit');

    if (this.mode === 'add') {
      this.originalBlogPost = JSON.parse(JSON.stringify(this.blogPost));
    }
    else if (this.mode === 'edit') {
      this.route.params
        .pipe(
          pluck('blogPostId'),
          filter(blogPostId => !!blogPostId),
          switchMap((blogPostId: string) => this.blogPostService.getBlogPost(parseInt(blogPostId, 10))),
        ).subscribe((details) => {

        this.blogPost = {
          id: details.id,
          title: details.title,
          text: details.text,
          author: details.author,
          date: details.date
        };
        this.pickerDate = new Date(details.date);
        this.originalBlogPost = JSON.parse(JSON.stringify(this.blogPost));
      });
    }
  }

  saveBlogPost() {

    if (this.mode === 'add') {
      this.store.dispatch(new CreateBlogPost(this.blogPost)).subscribe(() => {
        this.returnToRoot();
      });
    } else {
      this.store.dispatch(new UpdateBlogPost(this.blogPost)).subscribe(() => {
        this.returnToRoot();
      });
    }
  }

  getDateString(date: Date) {
    if (!date) {
      return null;
    }
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  returnToRoot() {
    this.router.navigate(['']);
  }

  cantBeSaved() {
    let cantBeSaved;

    // set updated date in blogPost object
    this.blogPost.date = this.getDateString(this.pickerDate);

    if (this.mode === 'add') {

      cantBeSaved = !this.blogPost.title || !this.blogPost.text ||
        !this.blogPost.author || !this.blogPost.date;

      const hasUC = !!this.blogPost.title
        || !!this.blogPost.text
        || !!this.blogPost.author
        || this.blogPost.date !== this.originalBlogPost.date;

      if (hasUC !== this.hasUnsavedChanges) {
        this.store.dispatch(new SetUnsavedChanges(hasUC));
        this.hasUnsavedChanges = hasUC;
      }

    } else if (this.mode === 'edit') {

      cantBeSaved = JSON.stringify(this.blogPost) === JSON.stringify(this.originalBlogPost);
      const hasUC = !cantBeSaved;

      if (hasUC !== this.hasUnsavedChanges) {
        this.store.dispatch(new SetUnsavedChanges(hasUC));
        this.hasUnsavedChanges = hasUC;
      }
    }

    return cantBeSaved;
  }
}
