import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTravelPage } from './create-travel.page';

describe('CreateTravelPage', () => {
  let component: CreateTravelPage;
  let fixture: ComponentFixture<CreateTravelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTravelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
