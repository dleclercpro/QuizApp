import { User } from '../../types/UserTypes';
import CallGET from '../base/CallGET';

export class CallGetUser extends CallGET<void, User> {

    constructor() {
        super('GetUser', `/api/user`);
    }
};