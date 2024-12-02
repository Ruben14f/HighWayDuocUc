import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPassengerPage } from './inicio-passenger.page';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment.test';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../common/services/auth.service';
import { CrearviajeService } from '../common/crearViaje/crearviaje.service';
import { of } from 'rxjs';

class AuthServiceMock {
  getCurrentUser() {
    return { uid: 'test-user-id' };
  }
}

class verViajesMock {
  obtenerViajes() {
    return of([]);
  }
}

describe('InicioPassengerPage', () => {
  let component: InicioPassengerPage;
  let fixture: ComponentFixture<InicioPassengerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPassengerPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: CrearviajeService, useClass: verViajesMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioPassengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
