import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const mockAngularFireAuth = {
    signInWithEmailAndPassword: jasmine.createSpy().and.callFake((email, password) => {
      if (email === 'mansilla@gmail.com' && password === 'Ruben123') {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        FormsModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Se ah ingresado correo y contraseña validos.', async () => {
    component.email = 'mansilla@gmail.com';
    component.password = 'Ruben123';

    const result = await mockAngularFireAuth.signInWithEmailAndPassword(component.email, component.password);
    expect(result).toBeTrue();
  });

  it('Error, correo ingresado es invalido', async () => {
    component.email = 'mansillagmail.com';
    component.password = 'Ruben123';

    const result = await mockAngularFireAuth.signInWithEmailAndPassword(component.email, component.password);
    expect(result).toBeFalse();
  });

  it('Error, contraseña ingresada es invalida', async () => {
    component.email = 'mansilla@gmail.com';
    component.password = 'Ru';

    const result = await mockAngularFireAuth.signInWithEmailAndPassword(component.email, component.password);
    expect(result).toBeFalse();
  });
});
