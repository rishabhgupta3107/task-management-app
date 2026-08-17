import { Component, OnInit } from '@angular/core';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { OrgRole, ORG_ROLES, TeamMember, orgRoleLabel } from '../models/user-profile';
import { Task } from '../task';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  readonly roles = ORG_ROLES;
  label = orgRoleLabel;

  members: TeamMember[] = [];
  loading = true;
  canManage = false;
  myUsername = '';

  newMember = '';
  addError = '';

  expanded: string | null = null;
  memberTasks: Task[] = [];
  tasksLoading = false;

  constructor(
    private teamService: TeamService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe((me) => {
      this.myUsername = me.username;
      this.canManage = !!me.canManageTeam;
      if (this.canManage) {
        this.load();
      } else {
        this.loading = false;
      }
    });
  }

  load(): void {
    this.loading = true;
    this.teamService.getReports().subscribe({
      next: (m) => {
        this.members = m;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  /** Manager options for reassignment: me plus everyone already in the team. */
  get managerOptions(): { username: string; label: string }[] {
    const opts = [{ username: this.myUsername, label: `${this.myUsername} (me)` }];
    for (const m of this.members) {
      opts.push({ username: m.username, label: m.fullName || m.username });
    }
    return opts;
  }

  addMember(): void {
    const username = this.newMember.trim();
    if (!username) return;
    this.addError = '';
    this.teamService.addMember(username).subscribe({
      next: () => {
        this.newMember = '';
        this.load();
      },
      error: (e) => {
        this.addError =
          e.status === 404
            ? `No user "${username}" found.`
            : e.error?.message || 'Could not add member.';
      },
    });
  }

  changeRole(member: TeamMember, role: OrgRole): void {
    this.teamService.updateMember(member.username, { orgRole: role }).subscribe({
      next: (updated) => this.replace(updated),
      error: () => this.load(),
    });
  }

  changeManager(member: TeamMember, managerUsername: string): void {
    if (managerUsername === member.username) return;
    this.teamService.updateMember(member.username, { managerUsername }).subscribe({
      next: () => this.load(),
      error: () => this.load(),
    });
  }

  toggleTasks(member: TeamMember): void {
    if (this.expanded === member.username) {
      this.expanded = null;
      return;
    }
    this.expanded = member.username;
    this.memberTasks = [];
    this.tasksLoading = true;
    this.teamService.memberTasks(member.username).subscribe({
      next: (page) => {
        this.memberTasks = page.content;
        this.tasksLoading = false;
      },
      error: () => (this.tasksLoading = false),
    });
  }

  private replace(updated: TeamMember): void {
    this.members = this.members.map((m) => (m.username === updated.username ? updated : m));
  }
}
