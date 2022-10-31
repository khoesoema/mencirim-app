import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
// import { UsersCollections } from '../../db/Users';
import { CashierOnGoingTransactionsCollections } from '../../db/Cashier';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish(
		'cashierOnGoingTransactions.countAll',
		function cashierOnGoingTransactions_countAll(data) {
			try {
				console.log('publish.cashierOnGoingTransactions.countAll');

				// let permissionData = UsersCollections.findOne(
				//     {
				//         _id: this.userId,
				//     },
				//     {
				//         fields: {
				//             _id: 1,
				//             permissions: 1,
				//         },
				//     }
				// );
				// if (permissionData && permissionData.permissions) {
				//     if (permissionData.permissions.MARKETS_READ === 0)
				//         throw new Meteor.Error(
				//             'Access Denied',
				//             'You dont have access to this item'
				//         );
				// }
				Counts.publish(
					this,
					'cashierOnGoingTransactions.countAll',
					CashierOnGoingTransactionsCollections.find({
						createdBy: Meteor.user().username,
					}),
					{ noReady: true }
				);
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.cashierOnGoingTransactions.countAll',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);

	Meteor.publish(
		'cashierOnGoingTransactions.countList',
		function cashierOnGoingTransactions_countAll(data) {
			try {
				console.log('publish.cashierOnGoingTransactions.countList');

				// let permissionData = UsersCollections.findOne(
				//     {
				//         _id: this.userId,
				//     },
				//     {
				//         fields: {
				//             _id: 1,
				//             permissions: 1,
				//         },
				//     }
				// );
				// if (permissionData && permissionData.permissions) {
				//     if (permissionData.permissions.MARKETS_READ === 0)
				//         throw new Meteor.Error(
				//             'Access Denied',
				//             'You dont have access to this item'
				//         );
				// }
				let warehouseID = data.warehouseID;
				Counts.publish(
					this,
					'cashierOnGoingTransactions.countList.' + warehouseID,
					CashierOnGoingTransactionsCollections.find({
						warehouseID,
						createdBy: Meteor.user().username,
					}),
					{ noReady: true }
				);
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.cashierOnGoingTransactions.countList',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);

	Meteor.publish(
		'cashierOnGoingTransactions.list',
		function cashierOnGoingTransactions_countAll(data) {
			try {
				console.log('publish.cashierOnGoingTransactions.list');

				// let permissionData = UsersCollections.findOne(
				//     {
				//         _id: this.userId,
				//     },
				//     {
				//         fields: {
				//             _id: 1,
				//             permissions: 1,
				//         },
				//     }
				// );
				// if (permissionData && permissionData.permissions) {
				//     if (permissionData.permissions.MARKETS_READ === 0)
				//         throw new Meteor.Error(
				//             'Access Denied',
				//             'You dont have access to this item'
				//         );
				// }

				let warehouseID = data.warehouseID;

				let datasCursor = CashierOnGoingTransactionsCollections.find(
					{
						warehouseID,
						createdBy: Meteor.user().username,
					},
					{
						sort: {
							createdAt: 1,
						},
					}
				);

				return datasCursor;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.cashierOnGoingTransactions.list',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);
}
