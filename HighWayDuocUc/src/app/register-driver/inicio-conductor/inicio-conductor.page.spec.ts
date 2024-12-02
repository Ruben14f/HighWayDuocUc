import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioConductorPage } from './inicio-conductor.page';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { CrearviajeService } from 'src/app/common/crearViaje/crearviaje.service';
import { SolicitudesService } from 'src/app/common/services/solicitudes.service';
import { AudioService } from 'src/app/audio.service';
import { environment } from 'src/environments/environment.test';

class AuthServiceMock {
  getCurrentUser() {
    return { uid: 'test-user-id' };
  }
}

class CrearviajeServiceMock {
  crearViaje() {
    return of({});
  }
}

class SolicitudesServiceMock {
  obtenerSolicitudes() {
    return of([]);
  }
}

class AudioServiceMock {
  playAudio() {
    return;
  }
}

describe('InicioConductorPage', () => {
  let component: InicioConductorPage;
  let fixture: ComponentFixture<InicioConductorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioConductorPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: CrearviajeService, useClass: CrearviajeServiceMock },
        { provide: SolicitudesService, useClass: SolicitudesServiceMock },
        { provide: AudioService, useClass: AudioServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
