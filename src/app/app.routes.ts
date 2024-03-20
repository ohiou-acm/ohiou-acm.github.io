import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MembersPageComponent } from './members-page/members-page.component';
import { EventsPageComponent } from './events-page/events-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'members',
    component: MembersPageComponent,
  },
  {
    path: 'events',
    component: EventsPageComponent,
  },
  // Catch Bad Routes
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
