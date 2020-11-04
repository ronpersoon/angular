import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import {BlogPost} from './app.model';

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

  constructor() {}
}
