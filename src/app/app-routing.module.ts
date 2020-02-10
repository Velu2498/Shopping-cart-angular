import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './error404/error404.component';


const routes: Routes = [
  {
    path:"login",
    component:LoginComponent,
},
{
    path:"register",
    component:RegisterComponent
},
{
  path:"home",
  component:HomeComponent
},
{
  path:"error",
  component:Error404Component
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
