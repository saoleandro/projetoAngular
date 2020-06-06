import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorComponent } from './pages/author/author/author.component';
import { AuthorsComponent } from './pages/author/authors/authors.component';

const routes: Routes = [
  {
    path: 'authors',
    component: AuthorsComponent,
  },
  {
    path: 'author',
    component: AuthorComponent,
  },
  {
    path: 'author/:id',
    component: AuthorComponent,
  },
  {
    path: '**',
    redirectTo: 'authors'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
