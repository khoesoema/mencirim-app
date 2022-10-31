import getCurrentLine from 'get-current-line';
import { Random } from 'meteor/random';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CurrenciesCollections } from '../../db/Currencies';
import {
	InvoicesTransactionsCollections,
	InvoicesTransactionsItemsCollections,
} from '../../db/Invoices';
import { ProductsCollections } from '../../db/Products';
import { SystemConfigCollections } from '../../db/Systems';
import { UOMCollections } from '../../db/UOM';
import { VendorsCollections } from '../../db/Vendors';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'purchaseInvoices.add'(data) {
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
				let invoiceNumber = data.invoiceNumber;
				let transactionDate = moment(data.transactionDate).toDate();
				let currencyID = data.currencyID;
				let vendorID = data.vendorID;
				let paidTotal = Number(data.paidTotal);
				let selectedProducts = data.selectedProducts;

				if (
					!vendorID ||
					!currencyID ||
					!transactionDate ||
					selectedProducts.length === 0
				) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Vendor, Mata Uang, Tanggal Transaksi, Produk Wajib Diisi';
					return returnData;
				}

				let submitedProductLength = selectedProducts.length;

				let countProduts = ProductsCollections.find({
					_id: {
						$in: selectedProducts.map(function (o) {
							return o._id;
						}),
					},
				}).count();

				if (countProduts !== submitedProductLength) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Produk tidak ditemukan';
					return returnData;
				}

				if (invoiceNumber) {
					let countExist = InvoicesTransactionsCollections.find({
						invoiceNumber,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Nomor Invoice Sudah ada di Sistem';
						return returnData;
					}
				} else {
					let updateResult = Promise.await(
						SystemConfigCollections.rawCollection().findOneAndUpdate(
							{
								name: 'INVOICENUMBER_COUNTER',
							},
							{
								$inc: {
									value: 1,
								},
								$setOnInsert: {
									_id: Random.id(),
								},
							},
							{
								returnOriginal: false,
								returnDocument: 'after',
								upsert: true,
							}
						)
					);

					let invoiceNumberCounter = 1;

					if (
						updateResult &&
						updateResult.hasOwnProperty('lastErrorObject') &&
						updateResult.lastErrorObject &&
						updateResult.lastErrorObject.hasOwnProperty(
							'updatedExisting'
						) &&
						updateResult.lastErrorObject.updatedExisting === false
					) {
						invoiceNumberCounter = 1;
					} else if (
						updateResult &&
						updateResult.hasOwnProperty('lastErrorObject') &&
						updateResult.lastErrorObject &&
						updateResult.lastErrorObject.hasOwnProperty(
							'updatedExisting'
						) &&
						updateResult.lastErrorObject.updatedExisting === true &&
						updateResult.hasOwnProperty('value') &&
						updateResult.value &&
						updateResult.value.hasOwnProperty('value') &&
						updateResult.value.value
					) {
						invoiceNumberCounter = updateResult.value.value;
					}

					invoiceNumber = invoiceNumberCounter
						.toString()
						.padStart(10, '0');
				}

				let countVendor = VendorsCollections.find({
					_id: vendorID,
				}).count();
				if (countVendor === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Vendor tidak ditemukan';
					return returnData;
				}

				let countCurrency = CurrenciesCollections.find({
					_id: currencyID,
				}).count();
				if (countCurrency === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Mata Uang tidak ditemukan';
					return returnData;
				}

				let uomIDs = selectedProducts.map(function (o) {
					return o.uomID;
				});

				if (uomIDs.length === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Produk yang diinput harus memiliki satuan';
					return returnData;
				}

				uomIDs = [...new Set(uomIDs)];

				let submitedUOMLength = uomIDs.length;

				let countUOMs = UOMCollections.find({
					_id: {
						$in: uomIDs,
					},
				}).count();

				if (countUOMs !== submitedUOMLength) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}

				let subTotal = 0;
				let discountTotal = 0;
				let grandTotal = 0;

				let invoicesProducts = [];

				selectedProducts.map((product) => {
					let newItem = {};

					let productID = product._id;
					let productUOMID = product.uomID;
					let productQuantity = Number(product.quantity);
					let productPrice = Number(product.price);
					let productDiscountPercentage = Number(
						product.discountPercentage
					);

					let productSubTotal = productQuantity * productPrice;
					let productDiscountTotal =
						productSubTotal * (productDiscountPercentage / 100);
					let productGrandTotal =
						productSubTotal - productDiscountTotal;

					subTotal = subTotal + productSubTotal;
					discountTotal = subTotal + productDiscountTotal;
					grandTotal = subTotal + productGrandTotal;

					newItem = {
						currencyID,
						invoiceNumber,
						productID,
						uomID: productUOMID,
						price: productPrice,
						quantity: productQuantity,
						status: 0,
						receivedQuantity: 0,
						grandTotal: productGrandTotal,
						subTotal: productSubTotal,
						discountTotal: productDiscountTotal,
						discountPercentage: productDiscountPercentage,
						modifiedAt: new Date(),
						createdAt: new Date(),
						modifiedBy: Meteor.user().username,
						createdBy: Meteor.user().username,
					};

					invoicesProducts.push(newItem);
				});

				let insertData = {
					invoiceNumber,
					transactionDate,
					currencyID,
					vendorID,
					paidTotal,
					subTotal,
					discountTotal,
					grandTotal,
					status: 0,
					type: 1,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};
				let invoiceID =
					InvoicesTransactionsCollections.insert(insertData);

				InvoicesTransactionsItemsCollections.batchInsert(
					invoicesProducts
				);

				addLog(this, {
					type: 'ADD',
					module: 'PURCHASEINVOICES',
					title: 'Add PurchaseInvoice ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message =
					'Data Transaksi Pembelian Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.purchaseInvoices.add',
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
