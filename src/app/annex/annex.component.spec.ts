import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexComponent } from './annex.component';

describe('AnnexComponent', () => {
  let component: AnnexComponent;
  let fixture: ComponentFixture<AnnexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
