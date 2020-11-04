import { Component, OnInit } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BlogPost} from '../app.model';
import {GetBlogPosts} from '../core/blogpost/blogpost.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  blogPosts: BlogPost[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetBlogPosts()).subscribe((response) => {
      console.log(response);
      this.blogPosts = response;
    } );
  }

}
