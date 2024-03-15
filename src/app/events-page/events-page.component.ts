import { Component, OnInit } from '@angular/core';
import { EventACM } from '../app.types';
import { MatButtonModule } from '@angular/material/button';
import { EventCardComponent } from '../event-card/event-card.component';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../event-form-dialog/event-form-dialog.component';

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [MatButtonModule, EventCardComponent],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss',
})
export class EventsPageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  eventsList: EventACM[] = [
    {
      title: 'Angular Presentation',
      description: 'Learn about getting started with Angular',
      upvotes: 0,
      date: new Date(2024, 2, 6),
      presenter: 'Jaret Crist',
    },
    {
      title: 'requested event',
      description: 'description',
      upvotes: 0,
    },
    {
      title: 'New Competition & React Presentation',
      description:
        'Introduce 2024 ACM Website Building Competition. Also learn the basics about React',
      upvotes: 0,
      date: new Date(2024, 1, 28),
      presenter: 'Owen Salyer',
    },
    {
      title: 'AutoHotKey Showcase',
      description: 'Show off some interesting AutoHotKey projects',
      upvotes: 0,
      presenter: 'Jakob Burkett',
    },
  ];

  upcomingEvents: EventACM[] = [];
  pastEvents: EventACM[] = [];
  requestedEvents: EventACM[] = [];

  seeingScheduledEvents = true;

  ngOnInit(): void {
    this.sortEvents();
  }

  sortEvents() {
    this.upcomingEvents = [];
    this.pastEvents = [];
    this.requestedEvents = [];

    this.eventsList.forEach((event) => {
      if (event.date) {
        if (event.date > new Date()) {
          this.upcomingEvents.push(event);
        } else {
          this.pastEvents.push(event);
        }
      } else {
        this.requestedEvents.push(event);
      }

      this.upcomingEvents.sort((a, b) => {
        if (a.date && b.date) {
          return a.date.getTime() - b.date.getTime();
        }
        return 0;
      });

      this.pastEvents.sort((a, b) => {
        if (a.date && b.date) {
          return b.date.getTime() - a.date.getTime();
        }
        return 0;
      });

      this.requestedEvents.sort((a, b) => {
        return b.upvotes - a.upvotes;
      });
    });
  }

  updateEvent(event: EventACM) {
    const index = this.eventsList.findIndex((e) => e.title === event.title);
    this.eventsList[index] = event;

    this.sortEvents();
  }

  addEvent() {
    const dialogRef = this.dialog.open(EventFormDialogComponent);

    dialogRef.afterClosed().subscribe((event: EventACM) => {
      if (event) {
        console.log(event);

        this.eventsList.push(event);
        this.sortEvents();
      }
    });
  }
}
