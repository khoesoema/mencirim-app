import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
// import { UsersCollections } from '../../db/Users';
import { AccountsCollections } from '../../db/Accounts';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('accounts.countAll', function accounts_countAll(data) {
		try {
			console.log('publish.accounts.countAll');

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
				'accounts.countAll',
				AccountsCollections.find({}),
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
				'publish.accounts.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('accounts.countList', function accounts_countAll(data) {
		try {
			console.log('publish.accounts.countList');

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

			let searchText = data.searchText;
			Counts.publish(
				this,
				'accounts.countList.' + searchText,
				AccountsCollections.find({
					$or: [
						{
							code: {
								$regex: searchText,
								$options: 'i',
							},
						},
						{
							name: {
								$regex: searchText,
								$options: 'i',
							},
						},
					],
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
				'publish.accounts.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('accounts.list', function accounts_countAll(data) {
		try {
			console.log('publish.accounts.list');

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

			let searchText = data.searchText;
			// let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			// let limit = 20;
			// let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = AccountsCollections.find(
				{
					$or: [
						{
							code: {
								$regex: searchText,
								$options: 'i',
							},
						},
						{
							name: {
								$regex: searchText,
								$options: 'i',
							},
						},
					],
				},
				{
					sort: sortObject,
					// skip: offset,
					// limit,
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
				'publish.accounts.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('accounts.getByID', function accounts_countAll(data) {
		try {
			console.log('publish.accounts.getByID');

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

			let _id = data._id;

			let datasCursor = AccountsCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.accounts.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('accounts.search', function accounts_countAll(data) {
		try {
			console.log('publish.accounts.search');

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

			let searchText = data.searchText;
			let selectedID = data.selectedID;

			if (searchText.length > 2) {
				let findOrObject = [
					{
						code: {
							$regex: searchText,
							$options: 'i',
						},
					},
					{
						name: {
							$regex: searchText,
							$options: 'i',
						},
					},
				];

				if (selectedID) {
					findOrObject.push({
						_id: selectedID,
					});
				}
				let datasCursor = AccountsCollections.find({
					$or: findOrObject,
				});

				return datasCursor;
			} else {
				if (selectedID) {
					let datasCursor = AccountsCollections.find({
						_id: selectedID,
					});

					return datasCursor;
				}
			}
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.accounts.search',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});
}
