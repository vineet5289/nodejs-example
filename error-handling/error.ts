import { Failure } from "./failure";

export enum UserError {
    InvalidCreationArguments,
}

export const invalidCreationArgumentsError = (): Failure<UserError.InvalidCreationArguments> => ({
    type: UserError.InvalidCreationArguments,
  reason: 'Email, Firstname and Lastname cannot be empty',
});