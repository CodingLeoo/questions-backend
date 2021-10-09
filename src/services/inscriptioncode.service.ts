import { isValidCode, addMinutes } from "./../utils/time.utils";
import { EnrollCode, InscriptionCode } from "./../models/inscriptioncode.model";
import { INTERNAL_SERVER_ERROR } from "http-status";




export const getInscriptionCode = async (courseId: string): Promise<EnrollCode> => {

    try {
        const currentCode = await InscriptionCode.findOne({ course: courseId });

        if (!currentCode)
            return await createInscriptionCode(courseId);

        if (isValidCode(currentCode.valid_until))
            return currentCode;
        else
            return updateInscriptionCode(currentCode);
    } catch (error) {
        throw { code: INTERNAL_SERVER_ERROR, status: error.toString() };
    }

}


const updateInscriptionCode = (enrollCode: EnrollCode): EnrollCode => {
    enrollCode.code = generateCode();
    enrollCode.valid_until = addMinutes(new Date(), 5);
    enrollCode.save();

    return enrollCode;
}

const createInscriptionCode = async (courseId: string): Promise<EnrollCode> => {

    const enrollCode = {
        code: generateCode(),
        valid_until: addMinutes(new Date(), 5),
        course: courseId
    } as EnrollCode;

    await InscriptionCode.create(enrollCode);

    return enrollCode;
}


const generateCode = (): number => {
    const maxdigits = 100000;
    const minDigits = 999999;
    return Math.floor(Math.random() * (maxdigits - minDigits + 1)) + minDigits;
}