import {Image} from './Image';

export interface Account {
  active: boolean;
  role: string;
  _id: string;
  city: string;
  name: string;
  postcode: string;
  phone: string;
  lname: string;
  token: string;
  email: string;
  birthday: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  avatar: Image;
  id: string;
}
