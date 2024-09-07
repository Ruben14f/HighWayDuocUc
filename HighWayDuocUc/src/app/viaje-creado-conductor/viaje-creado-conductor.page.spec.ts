import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeCreadoConductorPage } from './viaje-creado-conductor.page';

describe('ViajeCreadoConductorPage', () => {
  let component: ViajeCreadoConductorPage;
  let fixture: ComponentFixture<ViajeCreadoConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeCreadoConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
