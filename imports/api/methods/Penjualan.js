import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PenjualanCollections } from '../../db/Penjualan';
import { PenjualanDetailCollections } from '../../db/PenjualanDetail';
import { ProductsCollections, ProductsHistoriesCollections } from '../../db/Products';
import { ProfitCollections  } from '../../db/Profit';
import { addErrorLog, addLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'penjualan.add'(data) {
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

				let countExist = PenjualanCollections.find({
					noFaktur
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Transaksi Penjualan Sudah ada di Sistem';
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

				PenjualanCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'PEMBELIAN',
					title: 'Add Penjualan',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan  Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualan.add',
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
		'penjualan.edit'(data) {
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
					returnData.message = 'Data Penjualan tidak ditemukan';
					return returnData;
				}
				if (!noFaktur || !tglFaktur) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi No Faktur dan Tanggal Penjualan';
					return returnData;
				}

				let currData = PenjualanCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan  tidak ditemukan';
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

				PenjualanCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'PEMBELIAN',
					title: 'Edit Penjualan',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan  Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualan.edit',
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
		'penjualan.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = PenjualanCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan  tidak ditemukan';
					return returnData;
				}

				PenjualanCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'PEMBELIAN',
					title: 'Delete Penjualan',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan  Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualan.add',
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
		'penjualan.edit.reject'(data) {
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
					returnData.message = 'Data Penjualan tidak ditemukan';
					return returnData;
				}

				let currData = PenjualanCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan  tidak ditemukan';
					return returnData;
				}

				let updateData = {
                    status,
					rejectedAt: new Date(),
					rejectedBy: Meteor.user().username,
				};

				PenjualanCollections.update({ _id }, { $set: updateData });

				detail.map((item) => {
					PenjualanDetailCollections.update({_id: item._id}, { $set: { tglFaktur: currData.tglFaktur, status: 0 } });
				});

				addLog(this, {
					type: 'EDIT',
					module: 'PEMBELIAN',
					title: 'Edit Status Penjualan',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Status Penjualan Berhasil direjected !';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualan.edit',
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
		'penjualan.edit.approve'(data) {
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
					returnData.message = 'Data Penjualan tidak ditemukan';
					return returnData;
				}

				let currData = PenjualanCollections.findOne({
					noFaktur
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan  tidak ditemukan';
					return returnData;
				}

				let updateData = {
                    status,
					rejectedAt: new Date(),
					rejectedBy: Meteor.user().username,
				};

				PenjualanCollections.update({ _id }, { $set: updateData });

				let detail = PenjualanDetailCollections.find({noFaktur});

				detail.map((item) => {
					PenjualanDetailCollections.update({_id: item._id}, { $set: { tglFaktur: currData.tglFaktur, status: 1 } });

					let dataProd = ProductsCollections.findOne({ kodeBarang: item.kodeBarang });

					let sisaStok = Number(dataProd.qty) - Number(item.ktsKecil);

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
					let nomor = item.itemNo;

					dataprodhis.map((item) => {
						if (jlh > 0 ) {
							if ( (item.available - jlh ) > 0  ){
								profit += ((hrgjual - item.hargaModal) * jlh);
								let s = item.available - jlh;
								
								ProductsHistoriesCollections.update(
									{ _id: item._id }, 
									{ $set: { available: s } }
								)

								let pf = (hrgjual - item.hargaModal) * jlh;
								ProfitCollections.insert({
									noFaktur: noFaktur,
									itemNo: nomor,

									kodeBarang: item.kodeBarang,
									barcode: item.barcode,
									namaBarang: item.namaBarang,
									categoryID: item.categoryID,

									ktsKecil: jlh,
									satuanKecil: item.satuanKecil,

									hargaModal: item.hargaModal,
									hargaJual: hrgjual,
									profitJual: pf,

									createdAt: new Date(),
    								createdBy: Meteor.user().username,
								})

								jlh = 0;
							} else {
								profit += ((hrgjual - item.hargaModal) * item.available);
								ProductsHistoriesCollections.update(
									{ _id: item._id }, 
									{ $set: { available: 0 } }
								)
								
								let pf = (hrgjual - item.hargaModal) * item.available;
								ProfitCollections.insert({
									noFaktur: noFaktur,
									itemNo: item.itemNo,

									kodeBarang: item.kodeBarang,
									barcode: item.barcode,
									namaBarang: item.namaBarang,
									categoryID: item.categoryID,

									ktsKecil: item.available,
									satuanKecil: item.satuanKecil,

									hargaModal: item.hargaModal,
									hargaJual: hrgjual,
									profitJual: pf,

									createdAt: new Date(),
    								createdBy: Meteor.user().username,
								})

								jlh = jlh - item.available;
							}
						}
					})

					let insertHistory = {
						kodeBarang : item.kodeBarang,
						barcode: item.barcode,
						namaBarang: item.namaBarang,

						jenis: 'Penjualan',
						tglFaktur: currData.tglFaktur,
						noFaktur: noFaktur,
						supplierID: '',
						customerID: currData.customerID,

						ktsKecil: (item.ktsKecil * -1 ),
						ktsBesar: (item.ktsBesar * -1 ),

						satuanKecil: item.satuanKecil,
						satuanBesar: item.satuanBesar,
						qtyBonus: (item.qtyBonus * -1),

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
						profitJual: profit,

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
					module: 'PEMBELIAN',
					title: 'Edit Status Penjualan',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Status Penjualan Berhasil di-approved !';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualan.edit',
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
