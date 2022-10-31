import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PenjualanReturCollections } from '../../db/PenjualanRetur';
import { PenjualanReturDetailCollections } from '../../db/PenjualanReturDetail';
import { ProductsCollections, ProductsHistoriesCollections } from '../../db/Products';
import { addErrorLog, addLog } from './Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'penjualanretur.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let noFaktur = data.noFaktur;
				let tglFaktur = data.tglFaktur;
				let customerID = data.customerID;
				let currencyID = data.currencyID;

				let grandTotal = Number(data.grandTotal.toString().split(',').join(''));
                let status = 'Pending';
				let keterangan = data.keterangan;

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

				let countExist = PenjualanReturCollections.find({
					noFaktur
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Transaksi Penjualan Retur Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					noFaktur,
                    tglFaktur,
                    customerID,
                    currencyID,
                    grandTotal,
                    status,
					keterangan,
					createdAt: new Date(),
					createdBy: Meteor.user().username,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PenjualanReturCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'PENJUALAN RETUR',
					title: 'Add Penjualan Retur',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan Retur  Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualanretur.add',
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
		'penjualanretur.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let noFaktur = data.noFaktur;
				let tglFaktur = data.tglFaktur;
				let customerID = data.customerID;
				let currencyID = data.currencyID;

				let grandTotal = Number(data.grandTotal.toString().split(',').join(''));
                let status = 'Pending';
				let keterangan = data.keterangan;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Retur tidak ditemukan';
					return returnData;
				}
				if (!noFaktur || !tglFaktur) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi No Faktur dan Tanggal Penjualan Retur';
					return returnData;
				}

				let currData = PenjualanReturCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Retur tidak ditemukan';
					return returnData;
				}

				let updateData = {
					noFaktur,
                    tglFaktur,
                    customerID,
                    currencyID,
                    grandTotal,
                    status,
					keterangan,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PenjualanReturCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'PENJUALAN RETUR',
					title: 'Edit Penjualan Retur',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan Retur Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualanretur.edit',
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
		'penjualanretur.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = PenjualanReturCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Retur  tidak ditemukan';
					return returnData;
				}

				PenjualanReturCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'PENJUALAN RETUR',
					title: 'Delete Penjualan Retur',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan Retur  Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualanretur.add',
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
		'penjualanretur.edit.reject'(data) {
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
					returnData.message = 'Data Penjualan Retur tidak ditemukan';
					return returnData;
				}

				let currData = PenjualanReturCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Retur  tidak ditemukan';
					return returnData;
				}

				let updateData = {
                    status,
					rejectedAt: new Date(),
					rejectedBy: Meteor.user().username,
				};

				PenjualanReturCollections.update({ _id }, { $set: updateData });

				detail.map((item) => {
					PenjualanReturDetailCollections.update({_id: item._id}, { $set: { tglFaktur: currData.tglFaktur, status: 0 } });
				});

				addLog(this, {
					type: 'EDIT',
					module: 'PENJUALAN RETUR',
					title: 'Edit Status Penjualan Retur',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Status Penjualan Retur Berhasil direjected !';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualanretur.edit',
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
		'penjualanretur.edit.approve'(data) {
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
					returnData.message = 'Data Penjualan Retur tidak ditemukan';
					return returnData;
				}

				let currData = PenjualanReturCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Retur tidak ditemukan';
					return returnData;
				}

				let updateData = {
                    status,
					rejectedAt: new Date(),
					rejectedBy: Meteor.user().username,
				};

				PenjualanReturCollections.update({ _id }, { $set: updateData });

				let detail = PenjualanReturDetailCollections.find({noFaktur});

				detail.map((item) => {
					PenjualanReturDetailCollections.update({_id: item._id}, { $set: { tglFaktur: currData.tglFaktur, status: 1 } });

					let dataProd = ProductsCollections.findOne({ kodeBarang: item.kodeBarang });

					let sisaStok = Number(dataProd.qty) + Number(item.ktsKecil);

					let updateStok = {
						qty: sisaStok,
					};
					ProductsCollections.update({ kodeBarang: item.kodeBarang }, { $set: updateStok })

					let dataprodhis = 	ProductsHistoriesCollections.find(
											{ 
												kodeBarang: item.kodeBarang, 
												available: { $gt: 0 },
											},
											{
												sort: { tglFaktur: 1 }
											}
										);

					let jlh = item.ktsKecil;
					let profit = 0;
					let hrgjual = item.hargaJual;

					dataprodhis.map((item) => {
						if (jlh > 0 ) {
							if ( (item.available - jlh ) > 0  ){
								profit += ((hrgjual - item.hargaModal) * jlh);
								let s = item.available - jlh;
								ProductsHistoriesCollections.update(
									{ _id: item._id }, 
									{ $set: { available: s } }
								)
								jlh = 0;
							} else {
								profit += ((hrgjual - item.hargaModal) * item.available);
								ProductsHistoriesCollections.update(
									{ _id: item._id }, 
									{ $set: { available: 0 } }
								)
								jlh = jlh - item.available;
							}
						}
					})

					let insertHistory = {
						kodeBarang : item.kodeBarang,
						barcode: item.barcode,
						namaBarang: item.namaBarang,

						jenis: 'Retur Penjualan',
						tglFaktur: currData.tglFaktur,
						noFaktur: noFaktur,
						supplierID: '',
						customerID: currData.customerID,

						ktsKecil: item.ktsKecil,
						ktsBesar: item.ktsBesar,

						satuanKecil: item.satuanKecil,
						satuanBesar: item.satuanBesar,
						qtyBonus: item.qtyBonus,

						hargaBeli: 0,
						hargaBeliSatuan: 0,

						jenisDiskon1: item.jenisDiskon1,
						jenisDiskon2: 0,
						jenisDiskon3: 0,
						jenisDiskon4: 0,
						jenisDiskon5: 0,

						diskonPersen1: item.diskonPersen1,
						diskonPersen2: 0,
						diskonPersen3: 0,
						diskonPersen4: 0,
						diskonPersen5: 0,

						diskonHarga1: item.diskonHarga1,
						diskonHarga2: 0,
						diskonHarga3: 0,
						diskonHarga4: 0,
						diskonHarga5: 0,

						ppnPersen: item.ppnPersen,
						ppnHarga: item.ppnHarga,

						hargaModal: 0,
						hargaBruto: item.hargaBruto,
						hargaNetto: item.hargaNetto,

						hargaJual: item.hargaJual,
						profitJual: (profit * -1),

						hargaJualMember: 0,
						profitJualMember: 0,

						available: 0,

						createdAt: new Date(),
						createdBy: Meteor.user().username,
					};

					ProductsHistoriesCollections.insert(insertHistory);
				});

				addLog(this, {
					type: 'EDIT',
					module: 'PENJUALAN RETUR',
					title: 'Edit Status Penjualan Retur',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Status Penjualan Retur Berhasil di-approved !';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualanretur.edit',
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
