import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandProgressComponent } from './command-progress.component';

describe('CommandProgressComponent', () => {
  let component: CommandProgressComponent;
  let fixture: ComponentFixture<CommandProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
