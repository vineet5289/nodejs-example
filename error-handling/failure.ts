export interface Failure<FailureType extends string> {
    type: FailureType;
    reason: string;
}
