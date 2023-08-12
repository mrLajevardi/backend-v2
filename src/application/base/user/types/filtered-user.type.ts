import { User } from '@sentry/node';

export type FilteredUser = Omit<User, 'password' | 'vdcPassword'>;
