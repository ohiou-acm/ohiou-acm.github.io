import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Member } from '../app.types';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MemberFormDialogComponent } from '../member-form-dialog/member-form-dialog.component';

@Component({
  selector: 'app-members-page',
  standalone: true,
  imports: [MatExpansionModule, MemberCardComponent, MatButtonModule],
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.scss',
})
export class MembersPageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  membersList: Member[] = [
    {
      name: 'Jaret Crist',
      email: 'jc374719@ohio.edu',
      graduationDate: new Date(2024, 4, 3),
      employment: 'Nationwide - Technology Early Career Rotation Program',
      selfBio:
        "I've worked for OIT in the Student Software Engineering Program doing full-stack development since Sophomore year. Now I'm moving on to see what other options are out there.",
      photoURL:
        'data:image/jpeg;base64,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',
    },
    {
      name: 'Luke Haskell',
      email: '<insert email>',
      graduationDate: new Date(2024, 4, 3),
      officer: 'treasurer',
      employment: 'RoviSys',
    },
    {
      name: 'Justin Garey',
      email: '<insert email>',
      graduationDate: new Date(2023, 4, 3),
      officer: 'president',
    },
    {
      name: 'Owen Salyer',
      email: '<insert email>',
      graduationDate: new Date(2024, 4, 3),
      officer: 'president',
      employment: 'Grad School',
    },
    {
      name: 'Josh Marusek',
      email: '<insert email>',
      graduationDate: new Date(2025, 4, 3),
      officer: 'vice-president',
    },
  ];

  currentOfficers: Member[] = [];
  currentOfficersExpanded = true;

  currentMembers: Member[] = [];
  currentMembersExpanded = true;

  alumni: Member[] = [];
  alumniExpanded = true;

  ngOnInit() {
    // load users from firebase

    // sort members by graduation date, seniors at the top
    this.membersList.sort((a, b) => {
      return a.graduationDate.getTime() - b.graduationDate.getTime();
    });

    this.groupMembers();
  }

  //group members into current officers, current members, and alumni
  groupMembers() {
    this.currentOfficers = [];
    this.currentMembers = [];
    this.alumni = [];

    this.membersList.forEach((member) => {
      if (member.graduationDate > new Date()) {
        if (member.officer) {
          this.currentOfficers.push(member);
        } else {
          this.currentMembers.push(member);
        }
      } else {
        this.alumni.push(member);
      }
    });
  }

  // if user signed in then allow them to create themselves as a member
  updateMember(member?: Member) {
    const dialogRef = this.dialog.open(MemberFormDialogComponent, {
      data: member,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // update firebase with new member info

        const index = this.membersList.findIndex(
          (m) => m.email === result.email
        );
        if (index === -1) {
          this.membersList.push(result);
        } else {
          this.membersList[index] = result;
        }
        this.groupMembers();
      }
    });
  }
}
