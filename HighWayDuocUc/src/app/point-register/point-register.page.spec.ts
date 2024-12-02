import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointRegisterPage } from './point-register.page';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment.test'; // O crea una configuración de prueba mock

// Configuración mock de Firebase (puedes usar valores ficticios aquí)
const firebaseConfigMock = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
  measurementId: 'your-measurement-id'
};

class AngularFireAuthMock {
  currentUser = Promise.resolve({ uid: 'test-user-id' });
}

class AngularFirestoreMock {
  collection() {
    return { doc: () => ({ get: () => Promise.resolve({ exists: true }) }) };
  }
}

describe('PointRegisterPage', () => {
  let component: PointRegisterPage;
  let fixture: ComponentFixture<PointRegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PointRegisterPage],
      imports: [
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfigMock),
      ],
      providers: [
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        { provide: AngularFirestore, useClass: AngularFirestoreMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
