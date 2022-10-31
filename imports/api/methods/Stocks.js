import getCurrentLine from 'get-current-line';
import { Random } from 'meteor/random';
import moment from 'moment-timezone';
import 'moment/locale/id';
import {
	InvoicesTransactionsCollections,
	InvoicesTransactionsItemsCollections,
} from '../../db/Invoices';
import { ProductsCollections } from '../../db/Products';
import { RacksCollections } from '../../db/Racks';
import {
	StocksConversionsCollections,
	StocksConversionsItemsCollections,
	StocksLedgersCollections,
	StocksTransactionsCollections,
	StocksTransfersCollections,
	StocksTransfersItemsCollections,
} from '../../db/Stocks';
import { SystemConfigCollections } from '../../db/Systems';
import { UOMCollections } from '../../db/UOM';
import { WarehousesCollections } from '../../db/Warehouses';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'stockIn.add'(data) {
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
				let invoiceID = data.invoiceID;
				let warehouseID = data.warehouseID;
				let selectedProducts = data.selectedProducts;

				if (!invoiceID || selectedProducts.length === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan Pilih Invoice Pembelian dan Produk yang akan diterima';
					return returnData;
				}

				let invoiceData = InvoicesTransactionsCollections.findOne({
					_id: invoiceID,
					type: 1,
				});
				if (!invoiceData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Invoice tidak ditemukan';
					return returnData;
				}

				let countWarehouse = WarehousesCollections.find({
					_id: warehouseID,
				}).count();
				if (countWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Gudang tidak ditemukan';
					return returnData;
				}

				let submitedProductLength = selectedProducts.length;

				let countProducts = ProductsCollections.find({
					_id: {
						$in: selectedProducts.map(function (o) {
							return o._id;
						}),
					},
				}).count();

				if (countProducts !== submitedProductLength) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Produk tidak ditemukan';
					return returnData;
				}

				let invoicesItemsCursor =
					InvoicesTransactionsItemsCollections.find({
						invoiceNumber: invoiceData.invoiceNumber,
						productID: {
							$in: selectedProducts.map(function (o) {
								return o._id;
							}),
						},
					});

				let invoicesItems = invoicesItemsCursor.fetch();

				let countProductsOnInvoicesItems = invoicesItemsCursor.count();

				if (countProductsOnInvoicesItems !== submitedProductLength) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Data Produk harus sama dengan data invoice pembelian, produk diluar invoice pembelian tidak dapat diterima untuk invoice ini';
					return returnData;
				}

				let stockLedgers = [];

				let invoiceItemsBulk = Promise.await(
					InvoicesTransactionsItemsCollections.rawCollection().initializeUnorderedBulkOp(
						{}
					)
				);

				let stockLedgersBulk = Promise.await(
					StocksLedgersCollections.rawCollection().initializeUnorderedBulkOp(
						{}
					)
				);

				selectedProducts.forEach((product) => {
					let newItem = {};

					let productInvoiceNumber = invoiceData.invoiceNumber;
					let productInvoiceID = invoiceID;
					let productID = product._id;
					let productQuantity = Number(product.quantity);
					let productStatus = 0;

					if (productQuantity > 0) {
						let invoiceItem = invoicesItems.find(
							(x) => x.productID === productID
						);
						if (invoiceItem) {
							newItem = {
								type: 1,
								invoiceNumber: productInvoiceNumber,
								productID,
								uomID: invoiceItem.uomID,
								quantity: productQuantity,
								status: 0,
								modifiedAt: new Date(),
								createdAt: new Date(),
								modifiedBy: Meteor.user().username,
								createdBy: Meteor.user().username,
							};

							stockLedgersBulk
								.find({
									invoiceNumber: invoiceData.invoiceNumber,
									type: 1,
									productID,
									warehouseID,
								})
								.upsert()
								.update({
									$setOnInsert: {
										_id: Random.id(),
										createdAt: new Date(),
										createdBy: Meteor.user().username,
									},
									$set: {
										type: 1,
										invoiceNumber: productInvoiceNumber,
										productID,
										uomID: invoiceItem.uomID,
										status: 0,
										modifiedAt: new Date(),
										modifiedBy: Meteor.user().username,
									},
									$inc: {
										quantity: productQuantity,
									},
								});

							invoiceItemsBulk
								.find({
									invoiceNumber: invoiceData.invoiceNumber,
									productID,
								})
								.update({
									$inc: {
										receivedQuantity: productQuantity,
									},
								});
							stockLedgers.push(newItem);
						}
					}
				});

				if (returnData.code === 200) {
					let insertData = {
						invoiceNumber: invoiceData.invoiceNumber,
						status: 0,
						type: 1,
						transactionDate: invoiceData.transactionDate,
						modifiedAt: new Date(),
						createdAt: new Date(),
						modifiedBy: Meteor.user().username,
						createdBy: Meteor.user().username,
					};

					StocksTransactionsCollections.upsert(
						{
							invoiceNumber: invoiceData.invoiceNumber,
						},
						{
							$setOnInsert: insertData,
						}
					);

					if (stockLedgersBulk.length > 0) {
						Promise.await(stockLedgersBulk.execute());
					}
					if (invoiceItemsBulk.length > 0) {
						Promise.await(invoiceItemsBulk.execute());
					}

					addLog(this, {
						type: 'ADD',
						module: 'STOCKIN',
						title: 'Add StockIn ',
						description: JSON.stringify(insertData),
					});

					returnData.title = 'Berhasil';
					returnData.message = 'Data Stok Masuk Berhasil ditambah';
				}

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.stockIn.add',
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
		'stockTransfer.add'(data) {
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
				let description = data.description;
				let sourceWarehouseID = data.sourceWarehouseID;
				let sourceRackID = data.sourceRackID;
				let destinationWarehouseID = data.destinationWarehouseID;
				let destinationRackID = data.destinationRackID;
				let selectedProducts = data.selectedProducts;

				if (
					!sourceWarehouseID ||
					!destinationWarehouseID ||
					selectedProducts.length === 0
				) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan Pilih Gudang Asal dan Gudang Tujuan dan Produk yang akan ditransfer';
					return returnData;
				}

				let countSourceWarehouse = WarehousesCollections.find({
					_id: sourceWarehouseID,
				}).count();
				if (countSourceWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Gudang Asal tidak ditemukan';
					return returnData;
				}
				let countDestinationWarehouse = WarehousesCollections.find({
					_id: destinationWarehouseID,
				}).count();
				if (countDestinationWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Gudang Tujuan tidak ditemukan';
					return returnData;
				}

				if (sourceRackID) {
					let countSourceRack = RacksCollections.find({
						_id: sourceRackID,
					}).count();
					if (countSourceRack === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Rak Asal tidak ditemukan';
						return returnData;
					}
				}

				if (destinationRackID) {
					let countDestinationRack = RacksCollections.find({
						_id: destinationRackID,
					}).count();
					if (countDestinationRack === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Rak Tujuan tidak ditemukan';
						return returnData;
					}
				}

				let updateResult = Promise.await(
					SystemConfigCollections.rawCollection().findOneAndUpdate(
						{
							name: 'TRANSFERNUMBER_COUNTER',
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

				let transferNumberCounter = 1;

				if (
					updateResult &&
					updateResult.hasOwnProperty('lastErrorObject') &&
					updateResult.lastErrorObject &&
					updateResult.lastErrorObject.hasOwnProperty(
						'updatedExisting'
					) &&
					updateResult.lastErrorObject.updatedExisting === false
				) {
					transferNumberCounter = 1;
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
					transferNumberCounter = updateResult.value.value;
				}

				transferNumber = transferNumberCounter
					.toString()
					.padStart(10, '0');

				let stockLedgers = [];

				let stockTransfersItemsBulk = Promise.await(
					StocksTransfersItemsCollections.rawCollection().initializeUnorderedBulkOp(
						{}
					)
				);

				let stockLedgersBulk = Promise.await(
					StocksLedgersCollections.rawCollection().initializeUnorderedBulkOp(
						{}
					)
				);

				selectedProducts.forEach((product) => {
					let newItem = {};

					let warehouseID = undefined;
					let rackID = undefined;
					let productID = undefined;
					let uomID = undefined;

					let productItemID = product.itemID;
					let productName = product.productName;
					let productCode = product.productCode;
					let productUomName = product.uomName;
					let productUomCode = product.uomCode;
					let productQuantity = Number(product.quantity);

					if (productItemID && productQuantity) {
						if (productItemID.warehouseID) {
							warehouseID = productItemID.warehouseID;
						}
						if (productItemID.rackID) {
							rackID = productItemID.rackID;
						}
						if (productItemID.uomID) {
							uomID = productItemID.uomID;
						}
						if (productItemID.productID) {
							productID = productItemID.productID;
						}

						let currentStocks = Promise.await(
							StocksLedgersCollections.rawCollection()
								.aggregate(
									[
										{
											$match: {
												warehouseID,
												rackID,
												uomID,
												productID,
											},
										},
										{
											$group: {
												_id: null,
												quantity: {
													$sum: '$$ROOT.quantity',
												},
											},
										},
									],
									{ allowDiskUse: true }
								)
								.toArray()
						);

						if (currentStocks.length === 0) {
							returnData.code = 400;
							returnData.title = 'Kesalahan Validasi';
							returnData.message =
								'Stok [' +
								productCode +
								'] ' +
								productName +
								' [' +
								productUomCode +
								'] ' +
								productUomName +
								' tidak ditemukan';
							return returnData;
						}

						let currentStock = 0;

						currentStock = currentStocks[0].quantity;

						if (currentStock < productQuantity) {
							returnData.code = 400;
							returnData.title = 'Kesalahan Validasi';
							returnData.message =
								'Stok [' +
								productCode +
								'] ' +
								productName +
								' [' +
								productUomCode +
								'] ' +
								productUomName +
								' tidak mencukupi. Stok tersisa ' +
								currentStock
									.toString()
									.replace('.', ',')
									.replace(
										/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
										'$1.'
									) +
								' stok yang akan dipindah ' +
								productQuantity
									.toString()
									.replace('.', ',')
									.replace(
										/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
										'$1.'
									);
							return returnData;
						}

						stockTransfersItemsBulk.insert({
							_id: Random.id(),
							transferNumber,
							productID,
							warehouseID,
							uomID,
							rackID,
							quantity: productQuantity,
							modifiedAt: new Date(),
							createdAt: new Date(),
							modifiedBy: Meteor.user().username,
							createdBy: Meteor.user().username,
						});

						stockLedgersBulk.insert({
							_id: Random.id(),
							productID,
							warehouseID,
							uomID,
							rackID,
							quantity: productQuantity * -1,
							status: 0,
							modifiedAt: new Date(),
							createdAt: new Date(),
							modifiedBy: Meteor.user().username,
							createdBy: Meteor.user().username,
						});

						stockLedgersBulk.insert({
							_id: Random.id(),
							productID,
							warehouseID: destinationWarehouseID,
							uomID,
							rackID: destinationRackID,
							quantity: productQuantity,
							status: 0,
							modifiedAt: new Date(),
							createdAt: new Date(),
							modifiedBy: Meteor.user().username,
							createdBy: Meteor.user().username,
						});
					}
				});

				if (returnData.code === 200) {
					let insertData = {
						transferNumber,
						description,
						status: 0,
						transactionDate: moment()
							.set({ hour: 0, minute: 0, second: 0 })
							.toDate(),
						sourceWarehouseID,
						sourceRackID,
						destinationWarehouseID,
						destinationRackID,
						modifiedAt: new Date(),
						createdAt: new Date(),
						modifiedBy: Meteor.user().username,
						createdBy: Meteor.user().username,
					};

					StocksTransfersCollections.insert(insertData);

					if (stockLedgersBulk.length > 0) {
						Promise.await(stockLedgersBulk.execute());
					}
					if (stockTransfersItemsBulk.length > 0) {
						Promise.await(stockTransfersItemsBulk.execute());
					}

					addLog(this, {
						type: 'ADD',
						module: 'STOCKTRANSFER',
						title: 'Add StockTransfer ',
						description: JSON.stringify(insertData),
					});

					returnData.title = 'Berhasil';
					returnData.message = 'Data Transfer Stok Berhasil ditambah';
				}

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.stockTransfer.add',
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
		'stockConversion.add'(data) {
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
				let description = data.description;
				let warehouseID = data.warehouseID;
				let rackID = data.rackID;
				let selectedProducts = data.selectedProducts;

				if (!warehouseID || selectedProducts.length === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan Pilih Gudang  dan Produk yang akan dikonversi';
					return returnData;
				}

				let countWarehouse = WarehousesCollections.find({
					_id: warehouseID,
				}).count();
				if (countWarehouse === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Gudang tidak ditemukan';
					return returnData;
				}

				if (rackID) {
					let countRack = RacksCollections.find({
						_id: rackID,
					}).count();
					if (countRack === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Rak tidak ditemukan';
						return returnData;
					}
				}

				let updateResult = Promise.await(
					SystemConfigCollections.rawCollection().findOneAndUpdate(
						{
							name: 'CONVERSIONNUMBER_COUNTER',
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

				let conversionNumberCounter = 1;

				if (
					updateResult &&
					updateResult.hasOwnProperty('lastErrorObject') &&
					updateResult.lastErrorObject &&
					updateResult.lastErrorObject.hasOwnProperty(
						'updatedExisting'
					) &&
					updateResult.lastErrorObject.updatedExisting === false
				) {
					conversionNumberCounter = 1;
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
					conversionNumberCounter = updateResult.value.value;
				}

				conversionNumber = conversionNumberCounter
					.toString()
					.padStart(10, '0');

				let stockLedgers = [];

				let stockConversionsItemsBulk = Promise.await(
					StocksConversionsItemsCollections.rawCollection().initializeUnorderedBulkOp(
						{}
					)
				);

				let stockLedgersBulk = Promise.await(
					StocksLedgersCollections.rawCollection().initializeUnorderedBulkOp(
						{}
					)
				);

				selectedProducts.forEach((product) => {
					let newItem = {};

					let productWarehouseID = undefined;
					let productRackID = undefined;
					let productID = undefined;
					let uomID = undefined;

					let productItemID = product.itemID;
					let productName = product.productName;
					let productCode = product.productCode;
					let productUomName = product.uomName;
					let productUomCode = product.uomCode;
					let productSourceQuantity = Number(product.sourceQuantity);
					let productDestinationQuantity = Number(
						product.destinationQuantity
					);
					let productDestinationUOMID = product.destinationUOMID;

					if (
						productItemID &&
						productSourceQuantity &&
						productDestinationQuantity &&
						productDestinationUOMID
					) {
						if (productItemID.warehouseID) {
							productWarehouseID = productItemID.warehouseID;
						}
						if (productItemID.rackID) {
							productRackID = productItemID.rackID;
						}
						if (productItemID.uomID) {
							uomID = productItemID.uomID;
						}
						if (productItemID.productID) {
							productID = productItemID.productID;
						}

						let currentStocks = Promise.await(
							StocksLedgersCollections.rawCollection()
								.aggregate(
									[
										{
											$match: {
												warehouseID: productWarehouseID,
												rackID: productRackID,
												uomID,
												productID,
											},
										},
										{
											$group: {
												_id: null,
												quantity: {
													$sum: '$$ROOT.quantity',
												},
											},
										},
									],
									{ allowDiskUse: true }
								)
								.toArray()
						);

						if (currentStocks.length === 0) {
							returnData.code = 400;
							returnData.title = 'Kesalahan Validasi';
							returnData.message =
								'Stok [' +
								productCode +
								'] ' +
								productName +
								' [' +
								productUomCode +
								'] ' +
								productUomName +
								' tidak ditemukan';
							return returnData;
						}

						let currentStock = 0;

						currentStock = currentStocks[0].quantity;

						if (currentStock < productSourceQuantity) {
							returnData.code = 400;
							returnData.title = 'Kesalahan Validasi';
							returnData.message =
								'Stok [' +
								productCode +
								'] ' +
								productName +
								' [' +
								productUomCode +
								'] ' +
								productUomName +
								' tidak mencukupi. Stok tersisa ' +
								currentStock
									.toString()
									.replace('.', ',')
									.replace(
										/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
										'$1.'
									) +
								' stok yang akan dikonversi ' +
								productSourceQuantity
									.toString()
									.replace('.', ',')
									.replace(
										/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
										'$1.'
									);
							return returnData;
						}

						let countDestinationUOMID = UOMCollections.find({
							_id: productDestinationUOMID,
						}).count();

						if (countDestinationUOMID === 0) {
							returnData.code = 400;
							returnData.title = 'Kesalahan Validasi';
							returnData.message =
								'Satuan tidak ditemukan, silahkan pastikan semua satuan ada disistem';
							return returnData;
						}
						stockConversionsItemsBulk.insert({
							_id: Random.id(),
							conversionNumber,
							productID,
							sourceUOMID: uomID,
							destinationUOMID: productDestinationUOMID,
							sourceQuantity: productSourceQuantity,
							destinationQuantity: productDestinationQuantity,
							modifiedAt: new Date(),
							createdAt: new Date(),
							modifiedBy: Meteor.user().username,
							createdBy: Meteor.user().username,
						});

						stockLedgersBulk.insert({
							_id: Random.id(),
							productID,
							warehouseID: productWarehouseID,
							uomID,
							rackID: productRackID,
							quantity: productSourceQuantity * -1,
							status: 0,
							modifiedAt: new Date(),
							createdAt: new Date(),
							modifiedBy: Meteor.user().username,
							createdBy: Meteor.user().username,
						});

						stockLedgersBulk.insert({
							_id: Random.id(),
							productID,
							warehouseID: productWarehouseID,
							uomID: productDestinationUOMID,
							rackID: productRackID,
							quantity: productDestinationQuantity,
							status: 0,
							modifiedAt: new Date(),
							createdAt: new Date(),
							modifiedBy: Meteor.user().username,
							createdBy: Meteor.user().username,
						});
					}
				});

				if (returnData.code === 200) {
					let insertData = {
						conversionNumber,
						warehouseID,
						rackID,
						description,
						status: 0,
						transactionDate: moment()
							.set({ hour: 0, minute: 0, second: 0 })
							.toDate(),
						modifiedAt: new Date(),
						createdAt: new Date(),
						modifiedBy: Meteor.user().username,
						createdBy: Meteor.user().username,
					};

					StocksConversionsCollections.insert(insertData);

					if (stockLedgersBulk.length > 0) {
						Promise.await(stockLedgersBulk.execute());
					}
					if (stockConversionsItemsBulk.length > 0) {
						Promise.await(stockConversionsItemsBulk.execute());
					}

					addLog(this, {
						type: 'ADD',
						module: 'STOCKCONVERSION',
						title: 'Add StockConversion ',
						description: JSON.stringify(insertData),
					});

					returnData.title = 'Berhasil';
					returnData.message = 'Data Konversi Stok Berhasil ditambah';
				}

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.stockConversion.add',
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
