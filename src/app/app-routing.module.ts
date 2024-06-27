import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputConverterComponent } from './components/input-converter/input-converter.component';
import { LoginComponent } from './components/login/login.component';
import { ProductionTaskListComponent } from './components/production-task-list/production-task-list.component';
import { HomeComponent } from './components/home/home.component';
import { ComparerComponent } from './components/comparer/comparer.component';
import { ValidationComponent } from './components/validation/validation.component';
import { DeployComponent } from './components/deploy/deploy.component';

import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'convert', component: InputConverterComponent, canActivate: [authGuard] },
  { path: 'comparer', component: ComparerComponent, canActivate: [authGuard] },
  { path: 'validation', component: ValidationComponent, canActivate: [authGuard] },
  { path: 'deploy', component: DeployComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'production-list', component: ProductionTaskListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
