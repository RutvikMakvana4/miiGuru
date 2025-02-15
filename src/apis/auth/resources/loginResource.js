import moment from "moment";

export default class LoginResource {
    constructor(data) {
        this._id = data._id;
        this.name = data.name;
        this.email = data.email;
        this.joinedAt = moment(data.createdAt).unix();
        this.isAdmin = data.isAdmin;
    }
}