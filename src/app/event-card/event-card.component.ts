import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventACM, emptyEvent } from '../app.types';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent implements OnInit {
  @Input() event: EventACM = emptyEvent;
  @Input() isRequested = false;
  @Output() updateFunct = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  // mat toggle button uses string array values
  upvoteToggle = this.fb.group({
    toggle: [['']],
  });

  ngOnInit(): void {
    this.upvoteToggle.valueChanges.subscribe((value) => {
      if (value.toggle && value.toggle.length > 0) {
        this.event.upvotes++;
        // push name
      } else {
        this.event.upvotes--;
        // filter out name
      }
      this.updateFunct.emit({ event: this.event });
    });
  }
}
