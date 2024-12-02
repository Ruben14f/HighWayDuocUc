import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../common/services/auth.service';
import { DataService } from './info-sedes/data.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class AuthServiceMock {
  register() {
    return Promise.resolve('mock-user-id');
  }
}

class DataServiceMock {
  getSedes() {
    return of([]);
  }

  getCarreras() {
    return of([]);
  }
}

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        IonicModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: DataService, useClass: DataServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
