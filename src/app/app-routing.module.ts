import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputConverterComponent } from './components/input-converter/input-converter.component';
import { LoginComponent } from './components/login/login.component';
import { ProductionTaskListComponent } from './components/production-task-list/production-task-list.component';
import { HomeComponent } from './components/home/home.component';
import { ComparerComponent } from './components/comparer/comparer.component';
import { ValidationComponent } from './components/validation/validation.component';
import { DeployComponent } from './components/deploy/deploy.component';
import { JseditorComponent } from './components/jseditor/jseditor.component';

import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateCommentComponent } from './components/create-comment/create-comment.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'convert', component: InputConverterComponent, canActivate: [authGuard] },
  { path: 'editor', component: JseditorComponent, canActivate: [authGuard] },
  { path: 'comparer', component: ComparerComponent, canActivate: [authGuard] },
  { path: 'validation', component: ValidationComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'deploy', component: DeployComponent, canActivate: [authGuard] },
  { path: 'comment', component: CreateCommentComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'production-list', component: ProductionTaskListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
