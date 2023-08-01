import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './components/pages/manager/manager.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/manager',
    pathMatch: 'full',
    data: {
      title: 'Página inicial'
    }
  },
  {
    path: 'manager',
    component: ManagerComponent,
    data:
    {
      title: 'Gestão de OKRs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
