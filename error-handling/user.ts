import { Either, right, left } from "./Either";
import { Failure } from "./failure";

interface UserConstructorArgs {
    email: string;
    firstName: string;
    lastName: string;
}

export class User {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
  
    private constructor(props: UserConstructorArgs) {
      this.email = props.email;
      this.firstName = props.firstName;
      this.lastName = props.lastName;
    }

    static build({
        email,
        firstName,
        lastName
    }: {
        email: string,
        firstName: string,
        lastName: string
    }) : Either<Failure<UserError.InvalidCreationArguments>, User> {
        if ([email, firstName, lastName].some(field => field.length === 0)) {
            return left(invalidCreationArgumentsError());
        }
        return right(new User({ email, firstName, lastName }));
    }
}