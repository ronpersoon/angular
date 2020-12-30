import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NewBlogpostComponent} from './home/new-blogpost/new-blogpost.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'new-blogpost',
    component: NewBlogpostComponent,
    data: {mode: 'add'}
  },
  {
    path: 'new-blogpost/:blogPostId',
    component: NewBlogpostComponent,
    data: {mode: 'edit'}
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
