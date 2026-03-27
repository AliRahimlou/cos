export type UserRole = "learner" | "manager";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
};
