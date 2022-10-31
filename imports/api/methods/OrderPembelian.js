import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { OrderPembelianCollections } from '../../db/OrderPembelian';
import { OrderPembelianDetailCollections } from '../../db/OrderPembelianDetail';
import { ProductsCollections, ProductsHistoriesCollections } from '../../db/Products';
import { addErrorLog, addLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'orderpembelian.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let noFaktur = data.noFaktur;
				let tglFaktur = data.transactionDate;

				let vendorID = data.vendorID;
				let currencyID = data.currencyID;
                let noOrder = data.noOrder;

				let grandTotal = Number(data.grandTotal.toString().split(',').join(''));
                let status = 'Approved';

				if ( !noFaktur ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Nomor Faktur !';
					return returnData;
				}

				if ( !tglFaktur ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 
						'Silahkan isi tanggal Faktur ! ' ;
					return returnData;
				}

				let countExist = OrderPembelianCollections.find({
					noFaktur
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Transaksi Pembelian Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					noFaktur,
                    tglFaktur,
                    vendorID,
                    currencyID,
                    noOrder,
                    grandTotal,
                    status,
					createdAt: new Date(),
					createdBy: Meteor.user().username,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				OrderPembelianCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'PEMBELIAN',
					title: 'Add Pembelian',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Pembelian  Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembelian.add',
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
		'orderpembelian.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let noFaktur = data.noFaktur;
				let tglFaktur = data.transactionDate;

				let vendorID = data.vendorID;
				let currencyID = data.currencyID;
                let noOrder = data.noOrder;

				let grandTotal = Number(data.grandTotal.toString().split(',').join(''));
                let status = 'Approved';
				
				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian tidak ditemukan';
					return returnData;
				}
				if (!noFaktur || !tglFaktur) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi No Faktur dan Tanggal Pembelian';
					return returnData;
				}

				let currData = OrderPembelianCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian  tidak ditemukan';
					return returnData;
				}

				let updateData = {
					noFaktur,
                    tglFaktur,
                    vendorID,
                    currencyID,
                    noOrder,
                    grandTotal,
                    status,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				OrderPembelianCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'PEMBELIAN',
					title: 'Edit Pembelian',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Pembelian  Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembelian.edit',
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
		'orderpembelian.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = OrderPembelianCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian  tidak ditemukan';
					return returnData;
				}

				OrderPembelianCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'PEMBELIAN',
					title: 'Delete Pembelian',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Pembelian  Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembelian.add',
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
		'orderpembelian.edit.reject'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let noFaktur = data.noFaktur;
				let status = 'Rejected';
				
				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian tidak ditemukan';
					return returnData;
				}

				let currData = OrderPembelianCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian  tidak ditemukan';
					return returnData;
				}

				let updateData = {
                    status,
					rejectedAt: new Date(),
					rejectedBy: Meteor.user().username,
				};

				OrderPembelianCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'PEMBELIAN',
					title: 'Edit Status Pembelian',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Status Pembelian Berhasil direjected !';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembelian.edit',
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
		'orderpembelian.edit.approve'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let noFaktur = data.noFaktur;
				let status = 'Approved';
				
				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian tidak ditemukan';
					return returnData;
				}

				let currData = OrderPembelianCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian  tidak ditemukan';
					return returnData;
				}

				let updateData = {
                    status,
					rejectedAt: new Date(),
					rejectedBy: Meteor.user().username,
				};

				OrderPembelianCollections.update({ _id }, { $set: updateData });

				let detail = OrderPembelianDetailCollections.find({noFaktur});

				detail.map((item) => {
					OrderPembelianDetailCollections.update({_id: item._id}, { $set: { tglFaktur: currData.tglFaktur } });

					let dataProd = ProductsCollections.findOne({ kodeBarang: item.kodeBarang });

					let tmbhStok = Number(dataProd.qty) + Number(item.ktsKecil);

					let updateStok = {
						buktiFaktur: noFaktur,
						tglLastTrx: currData.tglFaktur,
						qty: tmbhStok,

						jenisdiskon1: item.jenisDiskon1,
						jenisdiskon2: item.jenisDiskon2,
						jenisdiskon3: item.jenisDiskon3,
						jenisdiskon4: item.jenisDiskon4,
						jenisdiskon5: item.jenisDiskon5,

						diskonpersen1: item.diskonPersen1,
						diskonpersen2: item.diskonPersen2,
						diskonpersen3: item.diskonPersen3,
						diskonpersen4: item.diskonPersen4,
						diskonpersen5: item.diskonPersen5,

						diskonharga1: item.diskonHarga1,
						diskonharga2: item.diskonHarga2,
						diskonharga3: item.diskonHarga3,
						diskonharga4: item.diskonHarga4,
						diskonharga5: item.diskonHarga5,

						ppnpersen: item.ppnPersen,
						ppnharga: item.ppnHarga,

						hargamodal: item.hargaModal,

						hargajual: item.hargaJual,
						profitjual: item.profitJual,

						hargajualmember: item.hargaJualMember,
						profitjualmember: item.profitJualMember,

						minimumjlh1: item.minimumJlh1,
						minimumjlh2: item.minimumJlh2,
						minimumjlh3: item.minimumJlh3,

						minimumpersen1: item.minimumPersen1,
						minimumpersen2: item.minimumPersen2,
						minimumpersen3: item.minimumPersen3,

						minimumharga1: item.minimumHarga1,
						minimumharga2: item.minimumHarga2,
						minimumharga3: item.minimumHarga3,

						kartonjlh: item.kartonJlh,
						kartonharga: item.kartonHarga,
						kartonpersen: item.kartonPersen,
					};
					ProductsCollections.update({ kodeBarang: item.kodeBarang }, { $set: updateStok })

					let insertHistory = {
						kodeBarang : item.kodeBarang,
						barcode: item.barcode,
						namaBarang: item.namaBarang,

						tglFaktur: currData.tglFaktur,
						noFaktur: noFaktur,
						supplierID: currData.vendorID,
						customerID: '',

						ktsKecil: item.ktsKecil,
						ktsBesar: item.ktsBesar,

						satuanKecil: item.satuanKecil,
						satuanBesar: item.satuanBesar,
						qtyBonus: item.qtyBonus,

						jenisDiskon1: item.jenisDiskon1,
						jenisDiskon2: item.jenisDiskon2,
						jenisDiskon3: item.jenisDiskon3,
						jenisDiskon4: item.jenisDiskon4,
						jenisDiskon5: item.jenisDiskon5,

						diskonPersen1: item.diskonPersen1,
						diskonPersen2: item.diskonPersen2,
						diskonPersen3: item.diskonPersen3,
						diskonPersen4: item.diskonPersen4,
						diskonPersen5: item.diskonPersen5,

						diskonHarga1: item.diskonHarga1,
						diskonHarga2: item.diskonHarga2,
						diskonHarga3: item.diskonHarga3,
						diskonHarga4: item.diskonHarga4,
						diskonHarga5: item.diskonHarga5,

						ppnpersen: item.ppnPersen,
						ppnharga: item.ppnHarga,

						hargaModal: item.hargaModal,
						hargaBruto: item.hargaBruto,
						hargaNetto: item.hargaNetto,

						hargaJual: item.hargaJual,
						hargaJual: item.hargaJual,

						hargaJualMember: item.hargaJualMember,
						profitJualMember: item.profitJualMember,

						createdAt: new Date(),
						createdBy: Meteor.user().username,
					};

					ProductsHistoriesCollections.insert(insertHistory);
				});

				addLog(this, {
					type: 'EDIT',
					module: 'PEMBELIAN',
					title: 'Edit Status Pembelian',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Status Pembelian Berhasil di-approved !';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembelian.edit',
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
