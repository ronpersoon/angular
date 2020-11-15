import { Injectable } from '@angular/core';
import {BlogPost} from '../../app.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  constructor(private http: HttpClient) { }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get('http://localhost:4200/assets/data.json') as Observable<BlogPost[]>;
  }
}
