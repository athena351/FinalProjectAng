export class UserDetails {
  phoneNumber!: string;
  address!: string;
  dob!: string;
  pictureUrl!: string;
}

export class User {
  id!: number;
  email!: string;
  role!: string;
  firstName!: string;
  lastName!: string;
  details!: UserDetails;
}

export class ProfileResponse {
  data!: User;
  meta!: any;
}