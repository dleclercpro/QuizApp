import CallDELETE from '../base/CallDELETE';

export class CallLogOut extends CallDELETE {

    constructor() {
        super('LogOut', `/api/auth`);
    }
};