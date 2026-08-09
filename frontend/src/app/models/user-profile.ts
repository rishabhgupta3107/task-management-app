export type OrgRole = 'MANAGER' | 'TEAM_LEAD' | 'WORKER';

export interface UserProfile {
  username: string;
  fullName?: string;
  email?: string;
  dob?: string;
  age?: number;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  timezone?: string;
  createdAt?: string;
  orgRole?: OrgRole;
  managerUsername?: string;
  managerName?: string;
  canManageTeam?: boolean;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  dob?: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  timezone?: string;
}

export interface TeamMember {
  id: number;
  username: string;
  fullName?: string;
  orgRole: OrgRole;
  avatarUrl?: string;
  managerUsername?: string;
  activeTasks: number;
}

export interface ManagerOption {
  username: string;
  fullName?: string;
}

export interface UpdateMemberPayload {
  orgRole?: OrgRole;
  managerUsername?: string;
}

export const ORG_ROLES: OrgRole[] = ['MANAGER', 'TEAM_LEAD', 'WORKER'];

export function orgRoleLabel(role: OrgRole | undefined): string {
  switch (role) {
    case 'MANAGER':
      return 'Manager';
    case 'TEAM_LEAD':
      return 'Team Lead';
    case 'WORKER':
      return 'Worker';
    default:
      return '—';
  }
}
