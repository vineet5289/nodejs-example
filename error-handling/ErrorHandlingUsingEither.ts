import { Either, left, right } from "./Either";

const negativePatientCountError = () => ({
    message: "All patient counts should be strictly positive",
});

const sumPatientCount = (...patientCounts: Array<number>): Either<{message: string}, number> => {
    if(patientCounts.some(patientCount => patientCount < 0)) {
        return left(negativePatientCountError());
    }

    return right(patientCounts.reduce((a, b) => a + b));
}