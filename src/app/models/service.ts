export interface Service {
  enable: boolean;
  _id: string;
  params: any[];
  name: string;
  viewType: number;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
  key: string;
  packages: any[];
  area?: number;
}
