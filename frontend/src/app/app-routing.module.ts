
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AuthGuardService as AuthGuard } from './shared/services/auth-guard.service';
export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      // { path: '', redirectTo: '/starter', pathMatch: 'full' },
      {
        path: '',
        loadChildren: './starter/starter.module#StarterModule'
      },
      {
        path: 'chat',
        loadChildren: './chats/chat.module#ChatsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'component',
        loadChildren: './component/component.module#ComponentsModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  },
];
