import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Member, emptyMember } from '../../app.types';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent implements OnInit {
  constructor(private userService: UserService) {}

  @Input() member: Member = emptyMember;
  @Output() updateFunct = new EventEmitter();

  gradSemester: string = 'Spring';

  canEdit = false;
  user = this.userService.getUser();

  ngOnInit(): void {
    this.gradSemester = this.getSemFromMonth(
      this.member.graduationDate.getMonth()
    );

    // Can Edit based on if logged in as user or as admin
    this.canEdit =
      this.user?.email === this.member.email ||
      this.user?.email === 'ohiouacmwebsite@gmail.com';
  }

  // Should always be May (4), August (7), or December (11)
  // Gave extra room in case the academic calendar changes
  getSemFromMonth(month: number): string {
    if (month >= 0 && month < 6) {
      return 'Spring';
    } else if (month >= 6 && month < 8) {
      return 'Summer';
    } else {
      return 'Fall';
    }
  }
}
