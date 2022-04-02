import { SpinnerComponent } from './modules/shared/components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { AngularFireModule } from '@angular/fire/compat';
import { AppComponent } from './app.component';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

// My material module
import { MaterialModule } from './material/material.module';
import { AppOverlayModule } from './material/overlay/appOverlay.module';

// Modules
import { SharedModule } from './modules/shared/shared.module';

// NOTE: Lazy loaded moduls do not need here in app.modules
// import { NutritionModule } from './modules/nutrition/nutrition.module';
// import { TrainingModule } from './modules/training/training.module';

@NgModule({
  declarations: [AppComponent], // TODO: SpinnerComponent Mast have?
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    AppOverlayModule,

    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAnalytics(() => getAnalytics()),
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase()),
    // provideFunctions(() => getFunctions()),
    // provideMessaging(() => getMessaging()),
    // providePerformance(() => getPerformance()),
    // provideRemoteConfig(() => getRemoteConfig()),
    // provideStorage(() => getStorage()),
    // provideFirestore(() => getFirestore()),
  ],
  entryComponents: [AppComponent, SpinnerComponent], // TODO: entryComponents ?!?
  exports: [RouterModule],
  providers: [
    AngularFirestoreModule,
    ScreenTrackingService,
    UserTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
