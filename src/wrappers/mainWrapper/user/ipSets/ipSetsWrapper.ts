import { userCreateIPSet } from './createIPSet';
import { userDeleteIPSet } from './deleteIPSet';
import { userGetIPSetsList } from './getIPSetsList';
import { userGetSingleIPSet } from './getSingleIPSet';
import { userUpdateIPSet } from './updateIPSet';

export const ipSetsWrapper = {
  getIPSetsList: userGetIPSetsList,
  getSingleIPSet: userGetSingleIPSet,
  createIPSet: userCreateIPSet,
  updateIPSet: userUpdateIPSet,
  deleteIPSet: userDeleteIPSet,
};
