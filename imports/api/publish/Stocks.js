import getCurrentLine from 'get-current-line';
// import { UsersCollections } from '../../db/Users';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import moment from 'moment-timezone';
import 'moment/locale/id';
import {
	StocksConversionsCollections,
	StocksLedgersCollections,
	StocksTransactionsCollections,
	StocksTransfersCollections,
} from '../../db/Stocks';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('stockIn.countAll', function stockIn_countAll(data) {
		try {
			console.log('publish.stockIn.countAll');

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
				'stockIn.countAll',
				StocksTransactionsCollections.find({ type: 1 }),
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
				'publish.stockIn.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('stockIn.countList', function stockIn_countAll(data) {
		try {
			console.log('publish.stockIn.countList');

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
				'stockIn.countList.' + searchText,
				StocksTransactionsCollections.find({
					type: 1,
					invoiceNumber: {
						$regex: searchText,
						$options: 'i',
					},
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
				'publish.stockIn.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('stockIn.list', function stockIn_countAll(data) {
		try {
			console.log('publish.stockIn.list');

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

			let findObject = {
				type: 1,
				invoiceNumber: {
					$regex: searchText,
					$options: 'i',
				},
			};

			ReactiveAggregate(
				this,
				StocksTransactionsCollections,
				[
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
							TS: '$$ROOT',
						},
					},
					{
						$project: {
							_id: '$TS._id',
							type: '$TS.type',
							transactionDate: '$TS.transactionDate',
							status: '$TS.status',
							invoiceNumber: '$TS.invoiceNumber',
							createdAt: '$TS.createdAt',
							createdBy: '$TS.createdBy',
							modifiedAt: '$TS.modifiedAt',
							modifiedBy: '$TS.modifiedBy',
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
				'publish.stockIn.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('stockIn.getByID', function stockIn_countAll(data) {
		try {
			console.log('publish.stockIn.getByID');

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

			ReactiveAggregate(
				this,
				StocksTransactionsCollections,
				[
					{
						$match: {
							_id,
						},
					},
					{
						$project: {
							_id: '$$ROOT._id',
							TS: '$$ROOT',
						},
					},

					{
						$project: {
							_id: '$_id',
							TS: '$TS',
						},
					},
					{
						$lookup: {
							from: 'tra_invoices_items',
							let: {
								invoiceNumber: '$TS.invoiceNumber',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: [
												'$invoiceNumber',
												'$$invoiceNumber',
											],
										},
									},
								},
								{
									$project: {
										_id: 0,
										TII: '$$ROOT',
									},
								},
								{
									$lookup: {
										from: 'mst_products',
										let: {
											productID: '$TII.productID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$productID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MP',
									},
								},
								{
									$unwind: {
										path: '$MP',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: 0,
										TII: '$TII',
										productName: '$MP.name',
										productCode: '$MP.code',
									},
								},
								{
									$lookup: {
										from: 'mst_uom',
										let: {
											uomID: '$TII.uomID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$uomID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MU',
									},
								},
								{
									$unwind: {
										path: '$MU',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: 0,
										TII: '$TII',
										productName: '$productName',
										productCode: '$productCode',
										uomName: '$MU.name',
										uomCode: '$MU.code',
									},
								},
							],
							as: 'TII',
						},
					},
					{
						$unwind: {
							path: '$TII',
							preserveNullAndEmptyArrays: true,
						},
					},
					{
						$project: {
							_id: '$_id',
							TS: '$TS',
							TII: '$TII',
						},
					},
					{
						$lookup: {
							from: 'tra_stocks_ledgers',
							let: {
								invoiceNumber: '$TS.invoiceNumber',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: [
												'$invoiceNumber',
												'$$invoiceNumber',
											],
										},
									},
								},
								{
									$project: {
										_id: 0,
										TSL: '$$ROOT',
									},
								},
								{
									$lookup: {
										from: 'mst_products',
										let: {
											productID: '$TSL.productID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$productID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MP',
									},
								},
								{
									$unwind: {
										path: '$MP',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: 0,
										TSL: '$TSL',
										productName: '$MP.name',
										productCode: '$MP.code',
									},
								},
								{
									$lookup: {
										from: 'mst_uom',
										let: {
											uomID: '$TSL.uomID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$uomID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MU',
									},
								},
								{
									$unwind: {
										path: '$MU',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: 0,
										TSL: '$TSL',
										productName: '$productName',
										productCode: '$productCode',
										uomName: '$MU.name',
										uomCode: '$MU.code',
									},
								},
								{
									$lookup: {
										from: 'mst_warehouses',
										let: {
											warehouseID: '$TSL.warehouseID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$warehouseID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MW',
									},
								},
								{
									$unwind: {
										path: '$MW',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: 0,
										TSL: '$TSL',
										productName: '$productName',
										productCode: '$productCode',
										uomName: '$uomName',
										uomCode: '$uomCode',
										warehouseName: '$MW.name',
										warehouseCode: '$MW.code',
									},
								},
							],
							as: 'TSL',
						},
					},
					{
						$unwind: {
							path: '$TSL',
							preserveNullAndEmptyArrays: true,
						},
					},
					{
						$project: {
							_id: '$_id',
							TS: '$TS',
							TII: '$TII',
							TSL: '$TSL',
						},
					},
					{
						$group: {
							_id: '$TS._id',
							stockData: {
								$first: '$TS',
							},
							invoiceItemData: {
								$addToSet: '$TII',
							},
							stockLedgerData: {
								$addToSet: '$TSL',
							},
						},
					},
					{
						$sort: {
							'stockLedgerData.productName': 1,
							'stockLedgerData.warehouseName': 1,
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
				'publish.stockIn.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish(
		'stockTransfer.countAll',
		function stockTransfer_countAll(data) {
			try {
				console.log('publish.stockTransfer.countAll');

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
					'stockTransfer.countAll',
					StocksTransfersCollections.find({ type: 1 }),
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
					'publish.stockTransfer.countAll',
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
		'stockTransfer.countList',
		function stockTransfer_countAll(data) {
			try {
				console.log('publish.stockTransfer.countList');

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
					'stockTransfer.countList.' + searchText,
					StocksTransactionsCollections.find({
						$or: [
							{
								transferNumber: {
									$regex: searchText,
									$options: 'i',
								},
							},
							{
								description: {
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
					'publish.stockTransfer.countList',
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

	Meteor.publish('stockTransfer.list', function stockTransfer_countAll(data) {
		try {
			console.log('publish.stockTransfer.list');

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

			let findObject = {
				$or: [
					{
						transferNumber: {
							$regex: searchText,
							$options: 'i',
						},
					},
					{
						description: {
							$regex: searchText,
							$options: 'i',
						},
					},
				],
			};

			ReactiveAggregate(
				this,
				StocksTransfersCollections,
				[
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
							TS: '$$ROOT',
						},
					},
					{
						$project: {
							_id: '$TS._id',
							transferNumber: '$TS.transferNumber',
							description: '$TS.description',
							transactionDate: '$TS.transactionDate',
							status: '$TS.status',
							sourceWarehouseID: '$TS.sourceWarehouseID',
							sourceRackID: '$TS.sourceRackID',
							destinationWarehouseID:
								'$TS.destinationWarehouseID',
							destinationRackID: '$TS.destinationRackID',
							createdAt: '$TS.createdAt',
							createdBy: '$TS.createdBy',
							modifiedAt: '$TS.modifiedAt',
							modifiedBy: '$TS.modifiedBy',
						},
					},
					{
						$lookup: {
							from: 'mst_warehouses',
							let: {
								sourceWarehouseID: '$sourceWarehouseID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: [
												'$_id',
												'$$sourceWarehouseID',
											],
										},
									},
								},
							],
							as: 'SMW',
						},
					},
					{
						$unwind: {
							path: '$SMW',
							preserveNullAndEmptyArrays: true,
						},
					},
					{
						$project: {
							_id: '$_id',
							transferNumber: '$transferNumber',
							description: '$description',
							transactionDate: '$transactionDate',
							status: '$status',
							sourceWarehouseID: '$sourceWarehouseID',
							sourceWarehouseName: '$SMW.name',
							sourceWarehouseCode: '$SMW.code',
							sourceRackID: '$sourceRackID',
							destinationWarehouseID: '$destinationWarehouseID',
							destinationRackID: '$destinationRackID',
							createdAt: '$createdAt',
							createdBy: '$createdBy',
							modifiedAt: '$modifiedAt',
							modifiedBy: '$modifiedBy',
						},
					},
					{
						$lookup: {
							from: 'mst_warehouses',
							let: {
								destinationWarehouseID:
									'$destinationWarehouseID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: [
												'$_id',
												'$$destinationWarehouseID',
											],
										},
									},
								},
							],
							as: 'DMW',
						},
					},
					{
						$unwind: {
							path: '$DMW',
							preserveNullAndEmptyArrays: true,
						},
					},
					{
						$project: {
							_id: '$_id',
							transferNumber: '$transferNumber',
							description: '$description',
							transactionDate: '$transactionDate',
							status: '$status',
							sourceWarehouseID: '$sourceWarehouseID',
							sourceWarehouseName: '$sourceWarehouseName',
							sourceWarehouseCode: '$sourceWarehouseCode',
							sourceRackID: '$sourceRackID',
							destinationWarehouseID: '$destinationWarehouseID',
							destinationWarehouseName: '$DMW.name',
							destinationWarehouseCode: '$DMW.code',
							destinationRackID: '$destinationRackID',
							createdAt: '$createdAt',
							createdBy: '$createdBy',
							modifiedAt: '$modifiedAt',
							modifiedBy: '$modifiedBy',
						},
					},
					{
						$lookup: {
							from: 'mst_racks',
							let: {
								sourceRackID: '$sourceRackID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: ['$_id', '$$sourceRackID'],
										},
									},
								},
							],
							as: 'SMR',
						},
					},
					{
						$unwind: {
							path: '$SMR',
							preserveNullAndEmptyArrays: true,
						},
					},
					{
						$project: {
							_id: '$_id',
							transferNumber: '$transferNumber',
							description: '$description',
							transactionDate: '$transactionDate',
							status: '$status',
							sourceWarehouseID: '$sourceWarehouseID',
							sourceWarehouseName: '$sourceWarehouseName',
							sourceWarehouseCode: '$sourceWarehouseCode',
							sourceRackID: '$sourceRackID',
							sourceRackName: '$SMR.name',
							sourceRackCode: '$SMR.code',
							destinationWarehouseID: '$destinationWarehouseID',
							destinationWarehouseName:
								'$destinationWarehouseName',
							destinationWarehouseCode:
								'$destinationWarehouseCode',
							destinationRackID: '$destinationRackID',
							createdAt: '$createdAt',
							createdBy: '$createdBy',
							modifiedAt: '$modifiedAt',
							modifiedBy: '$modifiedBy',
						},
					},
					{
						$lookup: {
							from: 'mst_racks',
							let: {
								destinationRackID: '$destinationRackID',
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: [
												'$_id',
												'$$destinationRackID',
											],
										},
									},
								},
							],
							as: 'DMR',
						},
					},
					{
						$unwind: {
							path: '$DMR',
							preserveNullAndEmptyArrays: true,
						},
					},
					{
						$project: {
							_id: '$_id',
							transferNumber: '$transferNumber',
							description: '$description',
							transactionDate: '$transactionDate',
							status: '$status',
							sourceWarehouseID: '$sourceWarehouseID',
							sourceWarehouseName: '$sourceWarehouseName',
							sourceWarehouseCode: '$sourceWarehouseCode',
							sourceRackID: '$sourceRackID',
							sourceRackName: '$sourceRackName',
							sourceRackCode: '$sourceRackCode',
							destinationWarehouseID: '$destinationWarehouseID',
							destinationWarehouseName:
								'$destinationWarehouseName',
							destinationWarehouseCode:
								'$destinationWarehouseCode',
							destinationRackID: '$destinationRackID',
							destinationRackName: '$DMR.name',
							destinationRackCode: '$DMR.code',
							createdAt: '$createdAt',
							createdBy: '$createdBy',
							modifiedAt: '$modifiedAt',
							modifiedBy: '$modifiedBy',
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
				'publish.stockTransfer.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish(
		'stockTransfer.getByID',
		function stockTransfer_countAll(data) {
			try {
				console.log('publish.stockTransfer.getByID');

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

				ReactiveAggregate(
					this,
					StocksTransfersCollections,
					[
						{
							$match: {
								_id,
							},
						},
						{
							$project: {
								_id: '$$ROOT._id',
								TS: '$$ROOT',
							},
						},

						{
							$project: {
								_id: '$_id',
								TS: '$TS',
							},
						},
						{
							$lookup: {
								from: 'tra_stocks_transfers_items',
								let: {
									transferNumber: '$TS.transferNumber',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: [
													'$transferNumber',
													'$$transferNumber',
												],
											},
										},
									},
									{
										$project: {
											_id: 0,
											TSTI: '$$ROOT',
										},
									},
									{
										$lookup: {
											from: 'mst_products',
											let: {
												productID: '$TSTI.productID',
											},
											pipeline: [
												{
													$match: {
														$expr: {
															$eq: [
																'$_id',
																'$$productID',
															],
														},
													},
												},
												{
													$project: {
														_id: '$$ROOT._id',
														name: '$$ROOT.name',
														code: '$$ROOT.code',
													},
												},
											],
											as: 'MP',
										},
									},
									{
										$unwind: {
											path: '$MP',
											preserveNullAndEmptyArrays: true,
										},
									},
									{
										$project: {
											_id: 0,
											TSTI: '$TSTI',
											productName: '$MP.name',
											productCode: '$MP.code',
										},
									},
									{
										$lookup: {
											from: 'mst_uom',
											let: {
												uomID: '$TSTI.uomID',
											},
											pipeline: [
												{
													$match: {
														$expr: {
															$eq: [
																'$_id',
																'$$uomID',
															],
														},
													},
												},
												{
													$project: {
														_id: '$$ROOT._id',
														name: '$$ROOT.name',
														code: '$$ROOT.code',
													},
												},
											],
											as: 'MU',
										},
									},
									{
										$unwind: {
											path: '$MU',
											preserveNullAndEmptyArrays: true,
										},
									},
									{
										$project: {
											_id: 0,
											TSTI: '$TSTI',
											productName: '$productName',
											productCode: '$productCode',
											uomName: '$MU.name',
											uomCode: '$MU.code',
										},
									},
								],
								as: 'TSTI',
							},
						},
						{
							$unwind: {
								path: '$TSTI',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTI: '$TSTI',
							},
						},
						{
							$lookup: {
								from: 'mst_warehouses',
								let: {
									sourceWarehouseID: '$TS.sourceWarehouseID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: [
													'$_id',
													'$$sourceWarehouseID',
												],
											},
										},
									},
								],
								as: 'SMW',
							},
						},
						{
							$unwind: {
								path: '$SMW',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTI: '$TSTI',
								sourceWarehouseName: '$SMW.name',
								sourceWarehouseCode: '$SMW.code',
							},
						},
						{
							$lookup: {
								from: 'mst_warehouses',
								let: {
									destinationWarehouseID:
										'$TS.destinationWarehouseID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: [
													'$_id',
													'$$destinationWarehouseID',
												],
											},
										},
									},
								],
								as: 'DMW',
							},
						},
						{
							$unwind: {
								path: '$DMW',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTI: '$TSTI',
								sourceWarehouseName: '$sourceWarehouseName',
								sourceWarehouseCode: '$sourceWarehouseCode',
								destinationWarehouseName: '$DMW.name',
								destinationWarehouseCode: '$DMW.code',
							},
						},
						{
							$lookup: {
								from: 'mst_racks',
								let: {
									sourceRackID: '$TS.sourceRackID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: ['$_id', '$$sourceRackID'],
											},
										},
									},
								],
								as: 'SMR',
							},
						},
						{
							$unwind: {
								path: '$SMR',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTI: '$TSTI',
								sourceWarehouseName: '$sourceWarehouseName',
								sourceWarehouseCode: '$sourceWarehouseCode',
								sourceRackName: '$SMR.name',
								sourceRackCode: '$SMR.code',
								destinationWarehouseName:
									'$destinationWarehouseName',
								destinationWarehouseCode:
									'$destinationWarehouseCode',
							},
						},
						{
							$lookup: {
								from: 'mst_racks',
								let: {
									destinationRackID: '$TS.destinationRackID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: [
													'$_id',
													'$$destinationRackID',
												],
											},
										},
									},
								],
								as: 'DMR',
							},
						},
						{
							$unwind: {
								path: '$DMR',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTI: '$TSTI',
								sourceWarehouseName: '$sourceWarehouseName',
								sourceWarehouseCode: '$sourceWarehouseCode',
								sourceRackName: '$sourceRackName',
								sourceRackCode: '$sourceRackCode',
								destinationWarehouseName:
									'$destinationWarehouseName',
								destinationWarehouseCode:
									'$destinationWarehouseCode',
								destinationRackName: '$DMR.name',
								destinationRackCode: '$DMR.code',
							},
						},
						{
							$group: {
								_id: '$TS._id',
								invoiceData: {
									$first: '$TS',
								},
								sourceWarehouseName: {
									$first: '$sourceWarehouseName',
								},
								sourceWarehouseCode: {
									$first: '$sourceWarehouseCode',
								},
								sourceRackName: {
									$first: '$sourceRackName',
								},
								sourceRackCode: {
									$first: '$sourceRackCode',
								},
								destinationWarehouseName: {
									$first: '$destinationWarehouseName',
								},
								destinationWarehouseCode: {
									$first: '$destinationWarehouseCode',
								},
								destinationRackName: {
									$first: '$destinationRackName',
								},
								destinationRackCode: {
									$first: '$destinationRackCode',
								},
								invoiceItemData: {
									$addToSet: '$TSTI',
								},
							},
						},
						{
							$sort: {
								'stockLedgerData.productName': 1,
								'stockLedgerData.warehouseName': 1,
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
					'publish.stockTransfer.getByID',
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
		'stockConversion.countList',
		function stockConversion_countAll(data) {
			try {
				console.log('publish.stockConversion.countList');

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
					'stockConversion.countList.' + searchText,
					StocksConversionsCollections.find({
						$or: [
							{
								conversionNumber: {
									$regex: searchText,
									$options: 'i',
								},
							},
							{
								description: {
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
					'publish.stockConversion.countList',
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
		'stockConversion.list',
		function stockConversion_countAll(data) {
			try {
				console.log('publish.stockConversion.list');

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

				let datasCursor = StocksConversionsCollections.find(
					{
						$or: [
							{
								conversionNumber: {
									$regex: searchText,
									$options: 'i',
								},
							},
							{
								description: {
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
					'publish.stockConversion.list',
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
		'stocksProducts.search',
		function stocksProducts_search(data) {
			try {
				console.log('publish.stocksProducts.search');

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
				let selectedIDs = data.selectedIDs;
				let searchText = data.searchText;
				let warehouseID = data.warehouseID;
				let rackID = data.rackID;

				if (warehouseID) {
					let matchObject = {
						warehouseID,
						rackID: {
							$exists: false,
						},
					};

					let groupIDStage = {
						warehouseID: '$$ROOT.warehouseID',
						productID: '$$ROOT.productID',
						uomID: '$$ROOT.uomID',
					};

					let concatStage = [
						'$_id.uomID',
						'-|-',
						'$_id.productID',
						'-|-',
						'',
						'-|-',
						'$_id.warehouseID',
					];

					if (rackID) {
						matchObject['rackID'] = rackID;
						groupIDStage = {
							warehouseID: '$$ROOT.warehouseID',
							rackID: '$$ROOT.rackID',
							productID: '$$ROOT.productID',
							uomID: '$$ROOT.uomID',
						};
						concatStage = [
							'$_id.uomID',
							'-|-',
							'$_id.productID',
							'-|-',
							'$_id.rackID',
							'-|-',
							'$_id.warehouseID',
						];
					}

					if (searchText.length > 2) {
						let findOrObject = [
							{
								productCode: {
									$regex: searchText,
									$options: 'i',
								},
							},
							{
								productName: {
									$regex: searchText,
									$options: 'i',
								},
							},
							{
								uomCode: {
									$regex: searchText,
									$options: 'i',
								},
							},
							{
								uomName: {
									$regex: searchText,
									$options: 'i',
								},
							},
						];

						if (selectedIDs) {
							findOrObject.push({
								_id: { $in: selectedIDs },
							});
						}

						ReactiveAggregate(
							this,
							StocksLedgersCollections,
							[
								{
									$match: matchObject,
								},
								{
									$group: {
										_id: groupIDStage,
										quantity: {
											$sum: '$$ROOT.quantity',
										},
									},
								},
								{
									$lookup: {
										from: 'mst_products',
										let: {
											productID: '$_id.productID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$productID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MP',
									},
								},
								{
									$unwind: {
										path: '$MP',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: '$_id',
										quantity: '$quantity',
										productName: '$MP.name',
										productCode: '$MP.code',
									},
								},
								{
									$lookup: {
										from: 'mst_uom',
										let: {
											uomID: '$_id.uomID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$uomID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MU',
									},
								},
								{
									$unwind: {
										path: '$MU',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: {
											$concat: concatStage,
										},
										itemID: '$_id',
										quantity: '$quantity',
										productName: '$productName',
										productCode: '$productCode',
										uomName: '$MU.name',
										uomCode: '$MU.code',
									},
								},
								{
									$match: {
										$or: findOrObject,
										quantity: {
											$gt: 0,
										},
									},
								},
							],
							{
								aggregationOptions: { allowDiskUse: true },
								debounceCount: 100,
								debounceDelay: 100,
							}
						);
					} else {
						ReactiveAggregate(
							this,
							StocksLedgersCollections,
							[
								{
									$match: matchObject,
								},
								{
									$group: {
										_id: groupIDStage,
										quantity: {
											$sum: '$$ROOT.quantity',
										},
									},
								},
								{
									$lookup: {
										from: 'mst_products',
										let: {
											productID: '$_id.productID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$productID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MP',
									},
								},
								{
									$unwind: {
										path: '$MP',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: '$_id',
										quantity: '$quantity',
										productName: '$MP.name',
										productCode: '$MP.code',
									},
								},
								{
									$lookup: {
										from: 'mst_uom',
										let: {
											uomID: '$_id.uomID',
										},
										pipeline: [
											{
												$match: {
													$expr: {
														$eq: [
															'$_id',
															'$$uomID',
														],
													},
												},
											},
											{
												$project: {
													_id: '$$ROOT._id',
													name: '$$ROOT.name',
													code: '$$ROOT.code',
												},
											},
										],
										as: 'MU',
									},
								},
								{
									$unwind: {
										path: '$MU',
										preserveNullAndEmptyArrays: true,
									},
								},
								{
									$project: {
										_id: {
											$concat: concatStage,
										},
										itemID: '$_id',
										quantity: '$quantity',
										productName: '$productName',
										productCode: '$productCode',
										uomName: '$MU.name',
										uomCode: '$MU.code',
									},
								},
								{
									$match: {
										_id: {
											$in: selectedIDs,
										},
										quantity: {
											$gt: 0,
										},
									},
								},
							],
							{
								aggregationOptions: { allowDiskUse: true },
								debounceCount: 100,
								debounceDelay: 100,
							}
						);
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
					'publish.stocksProducts.search',
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
		'stockConversion.getByID',
		function stockConversion_countAll(data) {
			try {
				console.log('publish.stockConversion.getByID');

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

				ReactiveAggregate(
					this,
					StocksConversionsCollections,
					[
						{
							$match: {
								_id,
							},
						},
						{
							$project: {
								_id: '$$ROOT._id',
								TS: '$$ROOT',
							},
						},

						{
							$project: {
								_id: '$_id',
								TS: '$TS',
							},
						},
						{
							$lookup: {
								from: 'tra_stocks_conversions_items',
								let: {
									conversionNumber: '$TS.conversionNumber',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: [
													'$conversionNumber',
													'$$conversionNumber',
												],
											},
										},
									},
									{
										$project: {
											_id: 0,
											TSTC: '$$ROOT',
										},
									},
									{
										$lookup: {
											from: 'mst_products',
											let: {
												productID: '$TSTC.productID',
											},
											pipeline: [
												{
													$match: {
														$expr: {
															$eq: [
																'$_id',
																'$$productID',
															],
														},
													},
												},
												{
													$project: {
														_id: '$$ROOT._id',
														name: '$$ROOT.name',
														code: '$$ROOT.code',
													},
												},
											],
											as: 'MP',
										},
									},
									{
										$unwind: {
											path: '$MP',
											preserveNullAndEmptyArrays: true,
										},
									},
									{
										$project: {
											_id: 0,
											TSTC: '$TSTC',
											productName: '$MP.name',
											productCode: '$MP.code',
										},
									},
									{
										$lookup: {
											from: 'mst_uom',
											let: {
												uomID: '$TSTC.sourceUOMID',
											},
											pipeline: [
												{
													$match: {
														$expr: {
															$eq: [
																'$_id',
																'$$uomID',
															],
														},
													},
												},
												{
													$project: {
														_id: '$$ROOT._id',
														name: '$$ROOT.name',
														code: '$$ROOT.code',
													},
												},
											],
											as: 'SMU',
										},
									},
									{
										$unwind: {
											path: '$SMU',
											preserveNullAndEmptyArrays: true,
										},
									},
									{
										$project: {
											_id: 0,
											TSTC: '$TSTC',
											productName: '$productName',
											productCode: '$productCode',
											sourceUomName: '$SMU.name',
											sourceUomCode: '$SMU.code',
										},
									},
									{
										$lookup: {
											from: 'mst_uom',
											let: {
												uomID: '$TSTC.destinationUOMID',
											},
											pipeline: [
												{
													$match: {
														$expr: {
															$eq: [
																'$_id',
																'$$uomID',
															],
														},
													},
												},
												{
													$project: {
														_id: '$$ROOT._id',
														name: '$$ROOT.name',
														code: '$$ROOT.code',
													},
												},
											],
											as: 'DMU',
										},
									},
									{
										$unwind: {
											path: '$DMU',
											preserveNullAndEmptyArrays: true,
										},
									},
									{
										$project: {
											_id: 0,
											TSTC: '$TSTC',
											productName: '$productName',
											productCode: '$productCode',
											sourceUomName: '$sourceUomName',
											sourceUomCode: '$sourceUomCode',
											destinationUomName: '$DMU.name',
											destinationUomCode: '$DMU.code',
										},
									},
								],
								as: 'TSTC',
							},
						},
						{
							$unwind: {
								path: '$TSTC',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTC: '$TSTC',
							},
						},
						{
							$lookup: {
								from: 'mst_warehouses',
								let: {
									warehouseID: '$TS.warehouseID',
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
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTC: '$TSTC',
								warehouseName: '$MW.name',
								warehouseCode: '$MW.code',
							},
						},
						{
							$lookup: {
								from: 'mst_racks',
								let: {
									rackID: '$TS.rackID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: ['$_id', '$$rackID'],
											},
										},
									},
								],
								as: 'MR',
							},
						},
						{
							$unwind: {
								path: '$MR',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TS: '$TS',
								TSTC: '$TSTC',
								warehouseName: '$warehouseName',
								warehouseCode: '$warehouseCode',
								rackName: '$MR.name',
								rackCode: '$MR.code',
							},
						},
						{
							$group: {
								_id: '$TS._id',
								invoiceData: {
									$first: '$TS',
								},
								warehouseName: {
									$first: '$warehouseName',
								},
								warehouseCode: {
									$first: '$warehouseCode',
								},
								rackName: {
									$first: '$rackName',
								},
								rackCode: {
									$first: '$rackCode',
								},
								invoiceItemData: {
									$addToSet: '$TSTC',
								},
							},
						},
						{
							$sort: {
								'stockLedgerData.productName': 1,
								'stockLedgerData.warehouseName': 1,
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
					'publish.stockConversion.getByID',
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
