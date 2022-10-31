import getCurrentLine from 'get-current-line';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import moment from 'moment-timezone';
import 'moment/locale/id';
// import { UsersCollections } from '../../db/Users';
import { RacksCollections } from '../../db/Racks';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('racks.countAll', function racks_countAll(data) {
		try {
			console.log('publish.racks.countAll');

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
			Counts.publish(this, 'racks.countAll', RacksCollections.find({}), {
				noReady: true,
			});
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.racks.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('racks.countList', function racks_countAll(data) {
		try {
			console.log('publish.racks.countList');

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
				'racks.countList.' + searchText,
				RacksCollections.find({
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
				'publish.racks.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('racks.list', function racks_countAll(data) {
		try {
			console.log('publish.racks.list');

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
			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;
			let findObject = {
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
			};
			if (warehouseID) {
				findObject['warehouseID'] = warehouseID;
			}

			ReactiveAggregate(
				this,
				RacksCollections,
				[
					{
						$sort: sortObject,
					},
					{
						$match: findObject,
					},
					{
						$skip: offset,
					},
					{
						$limit: limit,
					},
					{
						$project: {
							_id: 0,
							R: '$$ROOT',
						},
					},
					{
						$lookup: {
							from: 'mst_warehouses',
							let: {
								warehouseID: '$R.warehouseID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: ['$_id', '$$warehouseID'],
										},
									},
								},
							],
							as: 'MW',
						},
					},
					{
						$unwind: {
							path: '$MW',
							preserveNullAndEmptyArrays: false,
						},
					},
					{
						$project: {
							_id: 0,
							R: '$R',
							MW: '$MW',
						},
					},
					{
						$lookup: {
							from: 'mst_locations',
							let: {
								locationID: '$MW.locationID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: ['$_id', '$$locationID'],
										},
									},
								},
							],
							as: 'ML',
						},
					},
					{
						$unwind: {
							path: '$ML',
							preserveNullAndEmptyArrays: false,
						},
					},
					{
						$project: {
							_id: 0,
							R: '$R',
							MW: '$MW',
							ML: '$ML',
						},
					},
					{
						$project: {
							_id: '$R._id',
							name: '$R.name',
							code: '$R.code',
							locationID: '$ML._id',
							locationName: '$ML.name',
							locationCode: '$ML.code',
							warehouseID: '$MW._id',
							warehouseName: '$MW.name',
							warehouseCode: '$MW.code',
							createdAt: '$R.createdAt',
							createdBy: '$R.createdBy',
							modifiedAt: '$R.modifiedAt',
							modifiedBy: '$R.modifiedBy',
						},
					},
				],
				{
					debounceCount: 100,
					debounceDelay: 100,
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
				'publish.racks.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('racks.getByID', function racks_countAll(data) {
		try {
			console.log('publish.racks.getByID');

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

			let datasCursor = RacksCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.racks.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('racks.search', function racks_countAll(data) {
		try {
			console.log('publish.racks.search');

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

				if (warehouseID) {
					let datasCursor = RacksCollections.find({
						warehouseID,
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					let datasCursor = RacksCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				}
			} else {
				if (warehouseID) {
					if (selectedID) {
						let datasCursor = RacksCollections.find({
							warehouseID,
							_id: selectedID,
						});

						return datasCursor;
					}
				} else {
					if (selectedID) {
						let datasCursor = RacksCollections.find({
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
				'publish.racks.search',
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
