import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConductorBienvenidaPage } from './conductor-bienvenida.page';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

describe('ConductorBienvenidaPage', () => {
  let component: ConductorBienvenidaPage;
  let fixture: ComponentFixture<ConductorBienvenidaPage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConductorBienvenidaPage],
      imports: [
        CommonModule,
        IonicModule.forRoot(),

      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConductorBienvenidaPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
