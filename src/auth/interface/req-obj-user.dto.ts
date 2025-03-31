export interface ReqObjUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'admin';
  created_at: Date;
}
