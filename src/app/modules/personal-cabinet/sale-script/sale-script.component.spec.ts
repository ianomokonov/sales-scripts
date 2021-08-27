import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleScriptComponent } from './sale-script.component';

describe('SaleScriptComponent', () => {
  let component: SaleScriptComponent;
  let fixture: ComponentFixture<SaleScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
