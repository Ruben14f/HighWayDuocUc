import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointRegisterPage } from './point-register.page';
describe('PointRegisterPage', () => {
  let component: PointRegisterPage;
  let fixture: ComponentFixture<PointRegisterPage>;
  beforeEach(() => {
    fixture = TestBed.createComponent(PointRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
