import getCurrentLine from 'get-current-line';
import { Random } from 'meteor/random';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CashierOnGoingTransactionsCollections } from '../../db/Cashier';
import { ProductsCollections } from '../../db/Products';
import { UOMCollections } from '../../db/UOM';
import { WarehousesCollections } from '../../db/Warehouses';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'cashierOnGoingTransactions.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				// let permissionData = Meteor.user();
				// if (permissionData && permissionData.permissions) {
				// 	if (permissionData.permissions.BANKS_ADD === 0) {
				// 		returnData.code = 403;
				// 		returnData.title = 'Access Denied';
				// 		returnData.message =
				// 			'You dont have access to this item';
				// 		return returnData;
				// 	}
				// }
				let productCode = data.productCode;
				let warehouseID = data.warehouseID;

				let productData = ProductsCollections.findOne({
					code: productCode,
				});

				if (!productData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Produk tidak ditemukan';
					return returnData;
				}

				let countWarehouse = WarehousesCollections.find({
					_id: warehouseID,
				}).count();

				if (countWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Store tidak ditemukan';
					return returnData;
				}

				let uomData = UOMCollections.findOne({
					_id: productData.uomID,
				});

				if (!uomData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}

				let productSubTotal = 0;
				let productDiscountTotal = 0;
				let productDiscount = 0;
				let productPrice = 0;
				let currentData = CashierOnGoingTransactionsCollections.findOne(
					{ productCode, warehouseID }
				);

				if (currentData) {
					productSubTotal =
						currentData.productPrice *
						(currentData.productQuantity + 1);
					productDiscountTotal =
						productSubTotal * (productDiscount / 100);
					productSubTotal = productSubTotal - productDiscountTotal;
				}

				CashierOnGoingTransactionsCollections.upsert(
					{
						productCode,
						warehouseID,
					},
					{
						$setOnInsert: {
							_id: Random.id(),
							warehouseID,
							productID: productData._id,
							productName: productData.name,
							productCode: productData.code,
							productImage: productData.imageBase64,
							productPrice: productData.price,
							productUOMID: uomData._id,
							productUOMCode: uomData.code,
							productUOMName: uomData.name,
							productDescription: '',
							createdBy: Meteor.user().username,
							createdAt: new Date(),
						},
						$set: {
							modifiedBy: Meteor.user().username,
							modifiedAt: new Date(),
							productSubTotal,
							productDiscount,
							productDiscountTotal,
						},
						$inc: { productQuantity: 1 },
					}
				);

				addLog(this, {
					type: 'ADD',
					module: 'CASHIER',
					title: 'Add Cashier Item ',
					// description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Produk Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.cashierOnGoingTransactions.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error Code = ' +
						errorCode
				);
			} finally {
			}
		},
		'cashierOnGoingTransactions.changeQty'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				// let permissionData = Meteor.user();
				// if (permissionData && permissionData.permissions) {
				// 	if (permissionData.permissions.BANKS_ADD === 0) {
				// 		returnData.code = 403;
				// 		returnData.title = 'Access Denied';
				// 		returnData.message =
				// 			'You dont have access to this item';
				// 		return returnData;
				// 	}
				// }
				let productCode = data.productCode;
				let warehouseID = data.warehouseID;
				let quantity = Number(data.quantity);

				let productData = ProductsCollections.findOne({
					code: productCode,
				});

				if (!productData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Produk tidak ditemukan';
					return returnData;
				}

				let countWarehouse = WarehousesCollections.find({
					_id: warehouseID,
				}).count();

				if (countWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Store tidak ditemukan';
					return returnData;
				}

				let uomData = UOMCollections.findOne({
					_id: productData.uomID,
				});

				if (!uomData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}

				let productSubTotal = 0;
				let productDiscountTotal = 0;
				let productDiscount = 0;
				let productPrice = 0;
				let currentData = CashierOnGoingTransactionsCollections.findOne(
					{ productCode, warehouseID }
				);

				if (currentData) {
					if (quantity > 0) {
						productSubTotal = currentData.productPrice * quantity;
						productDiscountTotal =
							productSubTotal * (productDiscount / 100);
						productSubTotal =
							productSubTotal - productDiscountTotal;

						CashierOnGoingTransactionsCollections.update(
							{ productCode, warehouseID },
							{
								$set: {
									productQuantity: quantity,
									productSubTotal,
									productDiscountTotal,

									modifiedBy: Meteor.user().username,
									modifiedAt: new Date(),
								},
							}
						);
					} else {
						CashierOnGoingTransactionsCollections.remove({
							productCode,
							warehouseID,
						});
					}
				}

				addLog(this, {
					type: 'EDIT',
					module: 'CASHIER',
					title: 'Change Produk Quantity ',
					// description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Produk Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.cashierOnGoingTransactions.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error Code = ' +
						errorCode
				);
			} finally {
			}
		},
		'cashierOnGoingTransactions.changeDescription'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				// let permissionData = Meteor.user();
				// if (permissionData && permissionData.permissions) {
				// 	if (permissionData.permissions.BANKS_ADD === 0) {
				// 		returnData.code = 403;
				// 		returnData.title = 'Access Denied';
				// 		returnData.message =
				// 			'You dont have access to this item';
				// 		return returnData;
				// 	}
				// }
				let productCode = data.productCode;
				let warehouseID = data.warehouseID;
				let description = data.description;

				let productData = ProductsCollections.findOne({
					code: productCode,
				});

				if (!productData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Produk tidak ditemukan';
					return returnData;
				}

				let countWarehouse = WarehousesCollections.find({
					_id: warehouseID,
				}).count();

				if (countWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Store tidak ditemukan';
					return returnData;
				}

				let uomData = UOMCollections.findOne({
					_id: productData.uomID,
				});

				if (!uomData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}

				let currentData = CashierOnGoingTransactionsCollections.findOne(
					{ productCode, warehouseID }
				);

				if (currentData) {
					CashierOnGoingTransactionsCollections.update(
						{ productCode, warehouseID },
						{
							$set: {
								productDescription: description,
								modifiedBy: Meteor.user().username,
								modifiedAt: new Date(),
							},
						}
					);
				}

				addLog(this, {
					type: 'EDIT',
					module: 'CASHIER',
					title: 'Change Produk Quantity ',
					// description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Produk Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.cashierOnGoingTransactions.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error Code = ' +
						errorCode
				);
			} finally {
			}
		},
		'cashierOnGoingTransactions.deleteItem'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				// let permissionData = Meteor.user();
				// if (permissionData && permissionData.permissions) {
				// 	if (permissionData.permissions.BANKS_ADD === 0) {
				// 		returnData.code = 403;
				// 		returnData.title = 'Access Denied';
				// 		returnData.message =
				// 			'You dont have access to this item';
				// 		return returnData;
				// 	}
				// }
				let productCode = data.productCode;
				let warehouseID = data.warehouseID;

				let productData = ProductsCollections.findOne({
					code: productCode,
				});

				if (!productData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Produk tidak ditemukan';
					return returnData;
				}

				let countWarehouse = WarehousesCollections.find({
					_id: warehouseID,
				}).count();

				if (countWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Store tidak ditemukan';
					return returnData;
				}

				let uomData = UOMCollections.findOne({
					_id: productData.uomID,
				});

				if (!uomData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}

				let currentData = CashierOnGoingTransactionsCollections.findOne(
					{ productCode, warehouseID }
				);

				if (currentData) {
					CashierOnGoingTransactionsCollections.remove({
						productCode,
						warehouseID,
					});
				}

				addLog(this, {
					type: 'DELETE',
					module: 'CASHIER',
					title: 'Delete Product ',
					// description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Produk Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.cashierOnGoingTransactions.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error Code = ' +
						errorCode
				);
			} finally {
			}
		},
	});
}
