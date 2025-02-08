import moment from "moment";
import { baseUrl } from "../../../common/constants/configConstants";

export default class StudentOnboardingDetailResource {
    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.birthDate = data.birthDate ? moment(data.birthDate * 1000).format("DD/MM/YYYY") : null;
        this.photo = data.photo ? baseUrl(data.photo) : null
        this.email = data.email;
        this.phone = data.phone;
        this.fatherName = data.fatherName;
        this.motherName = data.motherName;
        this.address = data.address;
        this.city = data.city;
        this.country = data.country;
        this.schoolName = data.schoolName;
        this.board = data.board;
        this.mediumOfStudy = data.mediumOfStudy;
        this.class = data.class;
        this.major = data.major;
        this.subjects = data.subjects;
        this.otherSubject = data.otherSubject !== null ? data.otherSubject : null;
        this.otherActivities = data.otherActivities;
        this.selectedDays = data.selectedDays;
        this.timeAvailability = data.timeAvailability;
        this.timeToFinish = data.timeToFinish;
    }
}