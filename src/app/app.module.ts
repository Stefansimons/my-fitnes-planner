import { AuthEffects } from './modules/core/auth/store/auth.effects';
import { CoreModule } from './modules/core/core.module';
import { reducers } from './store/app.reducer';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppConfigService } from './core/app-config.service';
import { SpinnerComponent } from './modules/shared/components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { StoreModule } from '@ngrx/store';
import { TrainingListReducer } from './store/training-list.reducer';
import { EffectsModule } from '@ngrx/effects';
// import { TrainingListReducer } from './store/training-list.reducer';

// import { reducers } from './reducers/'

// NOTE: Lazy loaded moduls do not need here in app.modules
// import { NutritionModule } from './modules/nutrition/nutrition.module';
// import { TrainingModule } from './modules/training/training.module';

export function myAppConfigService(configService: AppConfigService) {
  return () => configService.load();
}

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
    HttpClientModule,
    StoreModule.forRoot(reducers),
    CoreModule,
    EffectsModule.forRoot([AuthEffects]),
  ],
  entryComponents: [AppComponent, SpinnerComponent], // TODO: entryComponents ?!?
  exports: [RouterModule],
  providers: [
    AngularFirestoreModule,
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: APP_INITIALIZER,
      useFactory: myAppConfigService,
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
