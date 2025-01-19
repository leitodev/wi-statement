import {Injectable, signal, WritableSignal} from '@angular/core';
import {UserLocales} from "../users/enums/user-locales";
import {UserTimeZones} from "../users/enums/user-timezones";
import {UserStatuses} from "../users/enums/user-statuses";
import {UserRoles} from "../users/enums/user-roles";

export interface Profile{
  avatarUrl: string | null;
}

export interface User{
  _id: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  locale: UserLocales;
  timezone: UserTimeZones;
  profile: Profile;
  status: UserStatuses;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  role: UserRoles;
  token: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public testData: WritableSignal<User[]> = signal([
    {
      _id: '14asd31asd23e',
      password: 'pass1',
      email: 'user1@gmail.com',
      name: 'Viktor',
      surname: 'Black',
      locale: UserLocales.en,
      timezone: UserTimeZones.AKST,
      profile: { avatarUrl: null },
      status: UserStatuses.active,
      emailVerified: true,
      lastLoginAt: null,
      role: UserRoles.employee,
      token: null,
    },
    {
      _id: '23asd12asd34f',
      password: 'pass2',
      email: 'user2@gmail.com',
      name: 'Anna',
      surname: 'Smith',
      locale: UserLocales.uk,
      timezone: UserTimeZones.EET,
      profile: { avatarUrl: null },
      status: UserStatuses.inactive,
      emailVerified: false,
      lastLoginAt: new Date('2023-12-01T10:30:00Z'),
      role: UserRoles.manager,
      token: null,
    },
    {
      _id: '34asd23asd45g',
      password: 'pass3',
      email: 'user3@gmail.com',
      name: 'John',
      surname: 'Doe',
      locale: UserLocales.en,
      timezone: UserTimeZones.HST,
      profile: { avatarUrl: 'https://example.com/avatar3.png' },
      status: UserStatuses.active,
      emailVerified: true,
      lastLoginAt: new Date('2024-01-01T12:00:00Z'),
      role: UserRoles.admin,
      token: 'token123',
    },
    {
      _id: '45asd34asd56h',
      password: 'pass4',
      email: 'user4@gmail.com',
      name: 'Emily',
      surname: 'Brown',
      locale: UserLocales.fr,
      timezone: UserTimeZones.MST,
      profile: { avatarUrl: null },
      status: UserStatuses.active,
      emailVerified: true,
      lastLoginAt: null,
      role: UserRoles.employee,
      token: null,
    },
    {
      _id: '56asd45asd67i',
      password: 'pass5',
      email: 'user5@gmail.com',
      name: 'Liam',
      surname: 'Wilson',
      locale: UserLocales.de,
      timezone: UserTimeZones.WET,
      profile: { avatarUrl: null },
      status: UserStatuses.inactive,
      emailVerified: false,
      lastLoginAt: new Date('2024-02-15T09:15:00Z'),
      role: UserRoles.manager,
      token: null,
    },
    {
      _id: '67asd56asd78j',
      password: 'pass6',
      email: 'user6@gmail.com',
      name: 'Olivia',
      surname: 'Davis',
      locale: UserLocales.es,
      timezone: UserTimeZones.UTC,
      profile: { avatarUrl: 'https://example.com/avatar6.png' },
      status: UserStatuses.inactive,
      emailVerified: false,
      lastLoginAt: null,
      role: UserRoles.employee,
      token: null,
    },
    {
      _id: '78asd67asd89k',
      password: 'pass7',
      email: 'user7@gmail.com',
      name: 'Noah',
      surname: 'Martinez',
      locale: UserLocales.it,
      timezone: UserTimeZones.AKST,
      profile: { avatarUrl: null },
      status: UserStatuses.active,
      emailVerified: true,
      lastLoginAt: new Date('2024-01-20T08:45:00Z'),
      role: UserRoles.admin,
      token: 'token456',
    },
    {
      _id: '89asd78asd90l',
      password: 'pass8',
      email: 'user8@gmail.com',
      name: 'Sophia',
      surname: 'Garcia',
      locale: UserLocales.tr,
      timezone: UserTimeZones.EET,
      profile: { avatarUrl: null },
      status: UserStatuses.active,
      emailVerified: true,
      lastLoginAt: new Date('2024-03-01T14:00:00Z'),
      role: UserRoles.manager,
      token: null,
    },
    {
      _id: '90asd89asd01m',
      password: 'pass9',
      email: 'user9@gmail.com',
      name: 'Ethan',
      surname: 'Taylor',
      locale: UserLocales.pl,
      timezone: UserTimeZones.ACST,
      profile: { avatarUrl: null },
      status: UserStatuses.inactive,
      emailVerified: false,
      lastLoginAt: null,
      role: UserRoles.employee,
      token: null,
    },
    {
      _id: '01asd90asd12n',
      password: 'pass10',
      email: 'user10@gmail.com',
      name: 'Isabella',
      surname: 'White',
      locale: UserLocales.tr,
      timezone: UserTimeZones.MST,
      profile: { avatarUrl: 'https://example.com/avatar10.png' },
      status: UserStatuses.active,
      emailVerified: true,
      lastLoginAt: new Date('2024-02-10T16:30:00Z'),
      role: UserRoles.employee,
      token: 'token789',
    },
]);

  constructor() { }

  getAllUsers(){
    return this.testData;
  }

  createUser(userData: any) {
    let userDataForm = userData.form;
    userDataForm.profile = { avatarUrl: userDataForm.avatarUrl };
    delete userDataForm.avatarUrl;

    // random id
    userDataForm._id = this.generateId();

    this.testData.update(prevArray => [...prevArray, userDataForm]);
  }

  // <ТУТ МАЄ БУТИ ГЕНЕРАЦІЯ ID>
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateId(){
    return this.getRandomNumber(1000, 100000)+'';
  }
  // <ТУТ МАЄ БУТИ ГЕНЕРАЦІЯ ID/>

}

