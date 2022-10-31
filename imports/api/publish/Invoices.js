import getCurrentLine from 'get-current-line';
// import { UsersCollections } from '../../db/Users';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CurrenciesCollections } from '../../db/Currencies';
import { InvoicesTransactionsCollections } from '../../db/Invoices';
import { VendorsCollections } from '../../db/Vendors';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish(
		'purchaseInvoices.countAll',
		function purchaseInvoices_countAll(data) {
			try {
				console.log('publish.purchaseInvoices.countAll');

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
					'purchaseInvoices.countAll',
					InvoicesTransactionsCollections.find({ type: 1 }),
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
					'publish.purchaseInvoices.countAll',
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
		'purchaseInvoices.countList',
		function purchaseInvoices_countAll(data) {
			try {
				console.log('publish.purchaseInvoices.countList');

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
					'purchaseInvoices.countList.' + searchText,
					InvoicesTransactionsCollections.find({
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
					'publish.purchaseInvoices.countList',
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
		'purchaseInvoices.list',
		function purchaseInvoices_countAll(data) {
			try {
				console.log('publish.purchaseInvoices.list');

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
					InvoicesTransactionsCollections,
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
								TI: '$$ROOT',
							},
						},
						{
							$lookup: {
								from: 'mst_vendors',
								let: {
									vendorID: '$TI.vendorID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: ['$_id', '$$vendorID'],
											},
										},
									},
								],
								as: 'MV',
							},
						},
						{
							$unwind: {
								path: '$MV',
								preserveNullAndEmptyArrays: false,
							},
						},
						{
							$project: {
								_id: 0,
								TI: '$TI',
								MV: '$MV',
							},
						},
						{
							$lookup: {
								from: 'mst_currencies',
								let: {
									currencyID: '$TI.currencyID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: ['$_id', '$$currencyID'],
											},
										},
									},
								],
								as: 'MC',
							},
						},
						{
							$unwind: {
								path: '$MC',
								preserveNullAndEmptyArrays: false,
							},
						},
						{
							$project: {
								_id: 0,
								TI: '$TI',
								MV: '$MV',
								MC: '$MC',
							},
						},
						{
							$project: {
								_id: '$TI._id',
								type: '$TI.type',
								transactionDate: '$TI.transactionDate',
								status: '$TI.status',
								invoiceNumber: '$TI.invoiceNumber',
								grandTotal: '$TI.grandTotal',
								paidTotal: '$TI.paidTotal',
								vendorCode: '$MV.code',
								vendorName: '$MV.name',
								currencyCode: '$MC.code',
								currencyName: '$MC.name',
								createdAt: '$TI.createdAt',
								createdBy: '$TI.createdBy',
								modifiedAt: '$TI.modifiedAt',
								modifiedBy: '$TI.modifiedBy',
							},
						},
					],
					{
						debounceCount: 100,
						debounceDelay: 100,
						observers: [
							InvoicesTransactionsCollections.find(findObject),
							VendorsCollections.find(),
							CurrenciesCollections.find(),
						],
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
					'publish.purchaseInvoices.list',
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
		'purchaseInvoices.getByID',
		function purchaseInvoices_countAll(data) {
			try {
				console.log('publish.purchaseInvoices.getByID');

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
					InvoicesTransactionsCollections,
					[
						{
							$match: {
								_id,
							},
						},
						{
							$project: {
								_id: '$$ROOT._id',
								TI: '$$ROOT',
							},
						},

						{
							$lookup: {
								from: 'mst_vendors',
								let: {
									vendorID: '$TI.vendorID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: ['$_id', '$$vendorID'],
											},
										},
									},
								],
								as: 'MV',
							},
						},
						{
							$unwind: {
								path: '$MV',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TI: '$TI',
								MV: '$MV',
							},
						},
						{
							$lookup: {
								from: 'mst_currencies',
								let: {
									currencyID: '$TI.currencyID',
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: ['$_id', '$$currencyID'],
											},
										},
									},
								],
								as: 'MC',
							},
						},
						{
							$unwind: {
								path: '$MC',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								_id: '$_id',
								TI: '$TI',
								MV: '$MV',
								MC: '$MC',
							},
						},
						{
							$lookup: {
								from: 'tra_invoices_items',
								let: {
									invoiceNumber: '$TI.invoiceNumber',
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
								TI: '$TI',
								MV: '$MV',
								MC: '$MC',
								TII: '$TII',
							},
						},
						{
							$group: {
								_id: '$TI._id',
								vendorData: {
									$first: '$MV',
								},
								currencyData: {
									$first: '$MC',
								},
								invoiceData: {
									$first: '$TI',
								},
								invoiceItemData: {
									$addToSet: '$TII',
								},
							},
						},
						{
							$sort: {
								'invoiceItemData.productName': 1,
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
					'publish.purchaseInvoices.getByID',
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
		'purchaseInvoices.search',
		function purchaseInvoices_search(data) {
			try {
				console.log('publish.purchaseInvoices.search');

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
							invoiceNumber: {
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

					let datasCursor = InvoicesTransactionsCollections.find({
						type: 1,
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					if (selectedID) {
						let datasCursor = InvoicesTransactionsCollections.find({
							type: 1,
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
					'publish.purchaseInvoices.search',
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
