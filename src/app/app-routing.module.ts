import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NewBlogpostComponent} from './home/new-blogpost/new-blogpost.component';
import {UnsavedChangesGuard} from './home/guards/unsaved-changes.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'new-blogpost',
    component: NewBlogpostComponent,
    data: {mode: 'add'},
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'new-blogpost/:blogPostId',
    component: NewBlogpostComponent,
    data: {mode: 'edit'},
    canDeactivate: [UnsavedChangesGuard]
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
