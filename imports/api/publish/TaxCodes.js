import getCurrentLine from 'get-current-line';
// import { UsersCollections } from '../../db/Users';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { TaxCodesCollections } from '../../db/TaxCodes';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('taxCodes.countAll', function taxCodes_countAll(data) {
		try {
			console.log('publish.taxCodes.countAll');

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
				'taxCodes.countAll',
				TaxCodesCollections.find({}),
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
				'publish.taxCodes.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('taxCodes.countList', function taxCodes_countAll(data) {
		try {
			console.log('publish.taxCodes.countList');

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
				'taxCodes.countList.' + searchText,
				TaxCodesCollections.find({
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
				'publish.taxCodes.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('taxCodes.list', function taxCodes_countAll(data) {
		try {
			console.log('publish.taxCodes.list');

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
			let purchaseAccountID = data.purchaseAccountID;
			let sellAccountID = data.sellAccountID;

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
			if (purchaseAccountID) {
				findObject['purchaseAccountID'] = purchaseAccountID;
			}
			if (sellAccountID) {
				findObject['sellAccountID'] = sellAccountID;
			}

			ReactiveAggregate(
				this,
				TaxCodesCollections,
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
							TC: '$$ROOT',
						},
					},
					{
						$lookup: {
							from: 'mst_accounts',
							let: {
								purchaseAccountID: '$TC.purchaseAccountID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: [
												'$_id',
												'$$purchaseAccountID',
											],
										},
									},
								},
							],
							as: 'MAP',
						},
					},
					{
						$unwind: {
							path: '$MAP',
							preserveNullAndEmptyArrays: false,
						},
					},
					{
						$project: {
							_id: 0,
							TC: '$TC',
							MAP: '$MAP',
						},
					},
					{
						$lookup: {
							from: 'mst_accounts',
							let: {
								sellAccountID: '$TC.sellAccountID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: ['$_id', '$$sellAccountID'],
										},
									},
								},
							],
							as: 'MAS',
						},
					},
					{
						$unwind: {
							path: '$MAS',
							preserveNullAndEmptyArrays: false,
						},
					},
					{
						$project: {
							_id: 0,
							TC: '$TC',
							MAP: '$MAP',
							MAS: '$MAS',
						},
					},
					{
						$project: {
							_id: '$TC._id',
							name: '$TC.name',
							code: '$TC.code',
							taxAmount: '$TC.amount',
							sellAccountID: '$MAS._id',
							sellAccountName: '$MAS.name',
							sellAccountCode: '$MAS.code',
							purchaseAccountID: '$MAP._id',
							purchaseAccountName: '$MAP.name',
							purchaseAccountCode: '$MAP.code',
							createdAt: '$TC.createdAt',
							createdBy: '$TC.createdBy',
							modifiedAt: '$TC.modifiedAt',
							modifiedBy: '$TC.modifiedBy',
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
				'publish.taxCodes.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('taxCodes.getByID', function taxCodes_countAll(data) {
		try {
			console.log('publish.taxCodes.getByID');

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

			let datasCursor = TaxCodesCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.taxCodes.getByID',
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
