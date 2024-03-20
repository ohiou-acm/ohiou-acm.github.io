import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { EventACM, emptyEvent } from '../../app.types';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../user.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';

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
export class EventCardComponent implements OnInit, OnDestroy {
  @Input() event: EventACM = emptyEvent;
  @Input() isRequested = false;
  @Output() updateFunct = new EventEmitter();

  constructor(private fb: FormBuilder, private userService: UserService) {}

  user: User | null = null;

  upvoteToggle = this.fb.group({
    toggle: [''],
  });

  subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getUser().subscribe((user) => {
        this.user = user;

        this.upvoteToggle.controls.toggle.setValue(
          this.user && this.event.upvotes.includes(this.user.email!)
            ? 'toggled'
            : ''
        );
      })
    );

    this.upvoteToggle.valueChanges.subscribe((value) => {
      if (value.toggle && value.toggle.length > 0) {
        // push name
        this.event.upvotes.push(this.user!.email!);
      } else {
        // filter out name
        this.event.upvotes = this.event.upvotes.filter(
          (name) => name !== this.user!.email!
        );
      }
      this.updateFunct.emit({ event: this.event });
    });
  }
}
