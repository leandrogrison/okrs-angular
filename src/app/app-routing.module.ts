import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './components/pages/manager/manager.component';
import { EstrategicMapComponent } from './components/pages/estrategic-map/estrategic-map.component';

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
    path: '**',
    redirectTo: '/manager'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
