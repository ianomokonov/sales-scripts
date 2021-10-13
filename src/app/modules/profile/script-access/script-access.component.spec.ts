import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptAccessComponent } from './script-access.component';

describe('ScriptAccessComponent', () => {
  let component: ScriptAccessComponent;
  let fixture: ComponentFixture<ScriptAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
