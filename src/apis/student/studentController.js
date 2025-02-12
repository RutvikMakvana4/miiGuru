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
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Student profile retrieved successfully",
            data
        });
    }

    /**
     * @description: Onboarding form
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async onboardingForm(req, res) {
        const data = await StudentServices.onboardingForm(req.body, req.file, req.user);
        return res.status(201).json({
            success: true,
            status: 201,
            message: "Onboarding form submitted successfully",
            data
        });
    }
}

export default StudentController;