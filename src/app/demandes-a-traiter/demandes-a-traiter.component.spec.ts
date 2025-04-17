import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesATraiterComponent } from './demandes-a-traiter.component';

describe('DemandesATraiterComponent', () => {
  let component: DemandesATraiterComponent;
  let fixture: ComponentFixture<DemandesATraiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesATraiterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandesATraiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
