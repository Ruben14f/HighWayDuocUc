import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTravelPage } from './create-travel.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment.test';
import { AuthService } from '../common/services/auth.service';
import { CrearviajeService } from '../common/crearViaje/crearviaje.service';

class AuthServiceMock {
  getCurrentUser() {
    return { uid: 'test-user-id' };
  }
}

class CrearviajeServiceMock {
  createTravel() {
    return Promise.resolve({ success: true });
  }
}

describe('CreateTravelPage', () => {
  let component: CreateTravelPage;
  let fixture: ComponentFixture<CreateTravelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTravelPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: CrearviajeService, useClass: CrearviajeServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTravelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
