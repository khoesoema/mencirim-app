import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
// import { UsersCollections } from '../../db/Users';
import { WarehousesCollections } from '../../db/Warehouses';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('warehouses.countAll', function warehouses_countAll(data) {
		try {
			console.log('publish.warehouses.countAll');

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
				'warehouses.countAll',
				WarehousesCollections.find({}),
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
				'publish.warehouses.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('warehouses.countList', function warehouses_countAll(data) {
		try {
			console.log('publish.warehouses.countList');

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
				'warehouses.countList.' + searchText,
				WarehousesCollections.find({
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
				'publish.warehouses.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('warehouses.list', function warehouses_countAll(data) {
		try {
			console.log('publish.warehouses.list');

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
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = WarehousesCollections.find(
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
					skip: offset,
					limit,
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
				'publish.warehouses.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('warehouses.getByID', function warehouses_countAll(data) {
		try {
			console.log('publish.warehouses.getByID');

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

			let datasCursor = WarehousesCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.warehouses.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('warehouses.search', function warehouses_countAll(data) {
		try {
			console.log('publish.warehouses.search');

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
			let isStore = Number(data.isStore);
			let selectedID = data.selectedID;
			let searchText = data.searchText;

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
				if (isStore === 1 || isStore === 0) {
					let datasCursor = WarehousesCollections.find({
						isStore,
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					let datasCursor = WarehousesCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				}
			} else {
				if (selectedID) {
					if (isStore === 1 || isStore === 0) {
						let datasCursor = WarehousesCollections.find({
							isStore,
							_id: selectedID,
						});

						return datasCursor;
					} else {
						let datasCursor = WarehousesCollections.find({
							_id: selectedID,
						});

						return datasCursor;
					}
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
				'publish.warehouses.search',
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
