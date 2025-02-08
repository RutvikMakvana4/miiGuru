import Onboarding from "../../../models/onboarding";
import User from "../../../models/users";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../common/exceptions/errorException";
import LoginResource from "../auth/resources/loginResource";
import StudentOnboardingDetailResource from "./resources/studentOnboardingDetailResource";



class StudentServices {
    /**
     * @description: Student profile
     * @param {*} auth 
     */
    static async studentProfile(auth) {
        const findStudent = await User.findOne({ _id: auth });

        if (!findStudent) {
            throw new NotFoundException("Student not found")
        }

        return { ... new LoginResource(findStudent) }
    }


    /**
     * @description: Onboarding form
     * @param {*} data 
     * @param {*} file 
     * @param {*} auth 
     */
    static async onboardingForm(data, file, auth) {
        const findStudent = await User.findById({ _id: auth });

        if (!findStudent) {
            throw new UnauthorizedException("Unauthorized");
        }

        const findStudentFormDetails = await Onboarding.findOne({ userId: auth });

        if (findStudentFormDetails) {
            throw new BadRequestException("Student already filled form details")
        }

        const updateData = { ...data };

        if (data.subjects) {
            updateData.subjects = data.subjects.split(",");
        }

        if (data.selectedDays) {
            updateData.selectedDays = data.selectedDays.split(",");
        }

        let photo = `students/photos/${file.filename}`;

        const studentFormDetails = await Onboarding.create({
            userId: auth,
            ...data,
            ...updateData,
            photo: photo
        });
        return {
            ... new StudentOnboardingDetailResource(studentFormDetails)
        }
    }
}

export default StudentServices;