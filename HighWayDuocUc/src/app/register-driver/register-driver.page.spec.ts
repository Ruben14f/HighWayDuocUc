import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterDriverPage } from './register-driver.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class AngularFireAuthMock {
  createUserWithEmailAndPassword() {
    return Promise.resolve({ user: { uid: 'mock-user-id' } });
  }
}

// Mock de AngularFirestore
class AngularFirestoreMock {
  collection() {
    return { add: () => Promise.resolve('mock-id') };
  }
}

class AngularFireStorageMock {
  upload() {
    return Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('mock-url') } });
  }
}

describe('RegisterDriverPage', () => {
  let component: RegisterDriverPage;
  let fixture: ComponentFixture<RegisterDriverPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterDriverPage],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        { provide: AngularFirestore, useClass: AngularFirestoreMock },
        { provide: AngularFireStorage, useClass: AngularFireStorageMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterDriverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
