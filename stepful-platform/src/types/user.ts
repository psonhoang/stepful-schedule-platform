export enum Role {
  COACH = "COACH",
  STUDENT = "STUDENT",
}
export type User = {
  id: number;
  name: string;
  phone: string;
  role: Role;
};
