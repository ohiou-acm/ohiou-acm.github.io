import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    importProvidersFrom(MatNativeDateModule),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ohiou-acm-website',
          appId: '1:529992121628:web:0bff0e99310fb9441a4ed9',
          storageBucket: 'ohiou-acm-website.appspot.com',
          apiKey: 'AIzaSyAXA_o6zQDGxqkU-SWmVQxQ3lhn8TuWSVU',
          authDomain: 'ohiou-acm-website.firebaseapp.com',
          messagingSenderId: '529992121628',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideDatabase(() => getDatabase())),
    importProvidersFrom(provideStorage(() => getStorage())),
    provideToastr(),
  ],
};
