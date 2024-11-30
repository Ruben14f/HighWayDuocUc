import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelHistoryPage } from './travel-history.page';
describe('TravelHistoryPage', () => {
  let component: TravelHistoryPage;
  let fixture: ComponentFixture<TravelHistoryPage>;
  beforeEach(() => {
    fixture = TestBed.createComponent(TravelHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
