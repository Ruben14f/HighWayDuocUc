import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeCreadoConductorPage } from './viaje-creado-conductor.page';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CrearviajeService } from '../common/crearViaje/crearviaje.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class AngularFireAuthMock {
  authState = of({ uid: 'mock-user-id' });
}

class AngularFirestoreMock {}

class CrearviajeServiceMock {
  crearViaje() {
    return of({ id: 'mock-viaje-id' });
  }
}

class NavControllerMock {
  navigate = jasmine.createSpy('navigate');
}

describe('ViajeCreadoConductorPage', () => {
  let component: ViajeCreadoConductorPage;
  let fixture: ComponentFixture<ViajeCreadoConductorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViajeCreadoConductorPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        { provide: AngularFirestore, useClass: AngularFirestoreMock },
        { provide: CrearviajeService, useClass: CrearviajeServiceMock },
        { provide: NavController, useClass: NavControllerMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViajeCreadoConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
