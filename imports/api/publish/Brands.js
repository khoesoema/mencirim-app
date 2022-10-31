import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
// import { UsersCollections } from '../../db/Users';
import { BrandsCollections } from '../../db/Brands';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('brands.countAll', function brands_countAll(data) {
		try {
			console.log('publish.brands.countAll');

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
				'brands.countAll',
				BrandsCollections.find({}),
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
				'publish.brands.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('brands.countList', function brands_countAll(data) {
		try {
			console.log('publish.brands.countList');

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
				'brands.countList.' + searchText,
				BrandsCollections.find({
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
				'publish.brands.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('brands.list', function brands_countAll(data) {
		try {
			console.log('publish.brands.list');

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

			let datasCursor = BrandsCollections.find(
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
				'publish.brands.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('brands.getByID', function brands_countAll(data) {
		try {
			console.log('publish.brands.getByID');

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

			let datasCursor = BrandsCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.brands.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('brands.search', function brands_countAll(data) {
		try {
			console.log('publish.brands.search');

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

				let datasCursor = BrandsCollections.find({
					$or: findOrObject,
				});

				return datasCursor;
			} else {
				if (selectedID) {
					let datasCursor = BrandsCollections.find({
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
				'publish.brands.search',
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
