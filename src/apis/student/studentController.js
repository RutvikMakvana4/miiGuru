import StudentServices from "./studentServices";

class StudentController {
    /**
        * @description: Student profile
        * @param {*} req 
        * @param {*} res 
        * @returns 
        */
    static async studentProfile(req, res) {
        const data = await StudentServices.studentProfile(req.user);
        return res.send({ data })
    }

    /**
     * @description: Onboarding form
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async onboardingForm(req, res) {
        const data = await StudentServices.onboardingForm(req.body, req.file, req.user);
        return res.send({ data })
    }
}

export default StudentController;