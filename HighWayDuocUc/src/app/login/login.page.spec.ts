import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment.test';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class AngularFireAuthMock {
  signInWithEmailAndPassword(email: string, password: string) {
    if (email === 'mansilla@gmail.com' && password === 'Ruben123') {
      return Promise.resolve({ user: { uid: 'mock-user-id' } });
    } else {
      return Promise.reject(new Error('Invalid credentials'));
    }
  }
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let angularFireAuth: AngularFireAuth;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        FormsModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      providers: [
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    angularFireAuth = TestBed.inject(AngularFireAuth);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Se ah ingresado correo y contraseña válidos.', async () => {
    component.email = 'mansilla@gmail.com';
    component.password = 'Ruben123';

    const result = await angularFireAuth.signInWithEmailAndPassword(component.email, component.password);
    expect(result).toBeTruthy();
  });

  it('Error, correo ingresado es inválido', async () => {
    component.email = 'mansillagmail.com';
    component.password = 'Ruben123';

    try {
      await angularFireAuth.signInWithEmailAndPassword(component.email, component.password);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('Error, contraseña ingresada es inválida', async () => {
    component.email = 'mansilla@gmail.com';
    component.password = 'Ru';

    try {
      await angularFireAuth.signInWithEmailAndPassword(component.email, component.password);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
