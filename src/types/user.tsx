export type User = {
  _id?: string;
  name: string;
  email?: string;
  password?: string;
};

export enum ProjectsType {
  Personal = `personal`,
  Outsourced = `outsourced`,
}
