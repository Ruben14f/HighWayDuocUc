import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPassengerPage } from './inicio-passenger.page';

describe('InicioPassengerPage', () => {
  let component: InicioPassengerPage;
  let fixture: ComponentFixture<InicioPassengerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioPassengerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
