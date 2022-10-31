import { UsersCollections } from '../../db/Users';
import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');
if (Meteor.isServer) {
	Meteor.publish('user', function () {
		try {
			console.log('publish.user');
			return UsersCollections.find(
				{ _id: this.userId },
				{
					fields: { permissions: 1, accountType: 1 },
				}
			);
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.user',
				tryErr.message
			);
			throw new Meteor.Error(
				'Unexpected Error',
				'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error Code = ' +
					errorCode
			);
		}
	});
}
