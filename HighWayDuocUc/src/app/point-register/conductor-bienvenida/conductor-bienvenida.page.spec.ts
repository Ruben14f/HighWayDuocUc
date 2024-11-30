import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConductorBienvenidaPage } from './conductor-bienvenida.page';
describe('ConductorBienvenidaPage', () => {
  let component: ConductorBienvenidaPage;
  let fixture: ComponentFixture<ConductorBienvenidaPage>;
  beforeEach(() => {
    fixture = TestBed.createComponent(ConductorBienvenidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
