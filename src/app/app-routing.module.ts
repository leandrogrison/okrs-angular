import { UsersComponent } from './components/pages/users/users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './components/pages/manager/manager.component';
import { EstrategicMapComponent } from './components/pages/estrategic-map/estrategic-map.component';
import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'manager',
    component: ManagerComponent,
    data:
    {
      title: 'Gestão de OKRs'
    }
  },
  {
    path: 'estrategic-map',
    component: EstrategicMapComponent,
    data:
    {
      title: 'Mapa estratégico'
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    data:
    {
      title: 'Usuários'
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
