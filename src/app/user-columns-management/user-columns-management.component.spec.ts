import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserColumnsManagementComponent } from './user-columns-management.component';

describe('UserColumnsManagementComponent', () => {
  let component: UserColumnsManagementComponent;
  let fixture: ComponentFixture<UserColumnsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserColumnsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserColumnsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
