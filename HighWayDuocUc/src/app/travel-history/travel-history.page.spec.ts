import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelHistoryPage } from './travel-history.page';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CrearviajeService } from '../common/crearViaje/crearviaje.service';
import { of } from 'rxjs';

class NavControllerMock {
  navigate = jasmine.createSpy('navigate');
}

class AngularFireAuthMock {
  authState = of({ uid: 'mock-user-id' });
}

class CrearviajeServiceMock {
  getTravelHistory() {
    return of([]);
  }
}

describe('TravelHistoryPage', () => {
  let component: TravelHistoryPage;
  let fixture: ComponentFixture<TravelHistoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TravelHistoryPage],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        { provide: CrearviajeService, useClass: CrearviajeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
