import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: 'switches', loadChildren: './switches/switches.module#SwitchesPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'graph', loadChildren: './graph/graph.module#GraphPageModule' },
  { path: 'setup', loadChildren: './setup/setup.module#SetupPageModule' },
  { path: 'voicecommand', loadChildren: './voicecommand/voicecommand.module#VoicecommandPageModule' },
  { path: 'dbmanger', loadChildren: './dbmanger/dbmanger.module#DBMangerPageModule' },
  { path: 'controler', loadChildren: './controler/controler.module#ControlerPageModule',},
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
  { path: 'prog-modal', loadChildren: './prog-modal/prog-modal.module#ProgModalPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })

  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
