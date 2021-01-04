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
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-new-blogpost',
  templateUrl: './new-blogpost.component.html',
  styleUrls: ['./new-blogpost.component.scss']
})
export class NewBlogpostComponent implements OnInit {

  @ViewChild('blogPostDate') blogPostDate;

  mode: string;
  originalBlogPost: string;
  date = new FormControl(new Date());
  hasUnsavedChanges = false;

  blogPost: BlogPost = {
    id: Math.floor(Math.random() * 9999999) + 1,
    title: null,
    text: null,
    author: null,
    date: null
  };

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private blogPostService: BlogPostService) {
  }

  ngOnInit(): void {

    this.mode = get(this.route, 'routeConfig.data.mode', 'edit');

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
      this.date = new FormControl(new Date(details.date));
      this.originalBlogPost = JSON.parse(JSON.stringify(this.blogPost));
    });
  }

  saveBlogPost() {

    // restore date
    this.blogPost.date = this.getFormDate();

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

  getFormDate() {
    return this.blogPostDate ? this.blogPostDate.nativeElement.value : '';
  }

  returnToRoot() {
    this.router.navigate(['']);
  }

  cantBeSaved() {
    let cantBeSaved;

    if (this.mode === 'add') {
      cantBeSaved = !this.blogPost.title || !this.blogPost.text ||
        !this.blogPost.author;

      const hasUC = !!this.blogPost.title
        || !!this.blogPost.text
        || !!this.blogPost.author;

      if (hasUC !== this.hasUnsavedChanges) {
        this.store.dispatch(new SetUnsavedChanges(hasUC));
        this.hasUnsavedChanges = hasUC;
      }

    } else if (this.mode === 'edit') {

      // restore date
      const formDate = this.getFormDate();
      if (formDate === '') {
        return false;
      }
      this.blogPost.date = formDate;

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
