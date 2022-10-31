import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { OrderPembelianDetailCollections } from '../../db/OrderPembelianDetail';
import { CategoriesCollections } from '../../db/Categories';
import { addErrorLog, addLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'orderpembeliandetail.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let noFaktur = data.noFaktur;
				let itemNo	= Number(data.itemNum);

				let kodeBarang = data.kodeBarang;
				let barcode = data.barcode;
				let namaBarang = data.namaBarang;
				let categoryID = data.categoryID;

				let ktsBesar = Number(data.ktsBesar);
				let ktsKecil = Number(data.ktsKecil);
				let satuanBesar = data.satuanBesar;
				let satuanKecil = data.satuanKecil;
				let qtyBonus = data.qtyBonus;

				let hargaBeli = Number(data.hargaBeli.toString().split(',').join(''));
				let hargaBeliSatuan = Number(data.hargaBeliSatuan.toString().split(',').join(''));

				let jenisDiskon1 = data.jenisDiskon1;
				let jenisDiskon2 = data.jenisDiskon2;
				let jenisDiskon3 = data.jenisDiskon3;
				let jenisDiskon4 = data.jenisDiskon4;
				let jenisDiskon5 = data.jenisDiskon5;

				let diskonPersen1 = Number(data.diskonPersen1.toString().split(',').join(''));
				let diskonPersen2 = Number(data.diskonPersen2.toString().split(',').join(''));
				let diskonPersen3 = Number(data.diskonPersen3.toString().split(',').join(''));
				let diskonPersen4 = Number(data.diskonPersen4.toString().split(',').join(''));
				let diskonPersen5 = Number(data.diskonPersen5.toString().split(',').join(''));

				let diskonHarga1 = Number(data.diskonHarga1.toString().split(',').join(''));
				let diskonHarga2 = Number(data.diskonHarga2.toString().split(',').join(''));
				let diskonHarga3 = Number(data.diskonHarga3.toString().split(',').join(''));
				let diskonHarga4 = Number(data.diskonHarga4.toString().split(',').join(''));
				let diskonHarga5 = Number(data.diskonHarga5.toString().split(',').join(''));

				let ppnPersen = Number(data.ppnPersen.toString().split(',').join(''));
				let ppnHarga = Number(data.ppnHarga.toString().split(',').join(''));

				let hargaModal = Number(data.hargaModal.toString().split(',').join(''));
				let hargaBruto = Number(data.hargaBruto.toString().split(',').join(''));
				let hargaNetto = Number(data.hargaNetto.toString().split(',').join(''));

				let hargaJual = Number(data.hargaJual.toString().split(',').join(''));
				let profitJual = Number(data.profitJual.toString().split(',').join(''));
				let hargaJualMember = Number(data.hargaJualMember.toString().split(',').join(''));
				let profitJualMember = Number(data.profitJualMember.toString().split(',').join(''));

				let minimumJlh1 = Number(data.minimumJlh1.toString().split(',').join(''));
				let minimumJlh2 = Number(data.minimumJlh2.toString().split(',').join(''));
				let minimumJlh3 = Number(data.minimumJlh3.toString().split(',').join(''));
				let minimumHarga1 = Number(data.minimumHarga1.toString().split(',').join(''));
				let minimumHarga2 = Number(data.minimumHarga2.toString().split(',').join(''));
				let minimumHarga3 = Number(data.minimumHarga3.toString().split(',').join(''));
				let minimumPersen1 = Number(data.minimumPersen1.toString().split(',').join(''));
				let minimumPersen2 = Number(data.minimumPersen2.toString().split(',').join(''));
				let minimumPersen3 = Number(data.minimumPersen3.toString().split(',').join(''));

				let kartonJlh = Number(data.kartonJlh.toString().split(',').join(''));
				let kartonHarga = Number(data.kartonHarga.toString().split(',').join(''));
				let kartonPersen = Number(data.kartonPersen.toString().split(',').join(''));

				if ( !kodeBarang ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Kode Barang !';
					return returnData;
				}

				if ( !ktsKecil ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 
						'Silahkan isi Kuantitas Barang !';
					return returnData;
				}

				if ( !hargaBeliSatuan) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 
						'Silahkan isi Harga Beli Barang !';
					return returnData;
				}

				let countExist = OrderPembelianDetailCollections.find({
					noFaktur, itemNo
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian Detail Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					itemNo,
					noFaktur,

					kodeBarang,
					barcode,
					namaBarang,
					categoryID,

					ktsBesar,
					ktsKecil,
					satuanBesar,
				 	satuanKecil,
					qtyBonus,
					hargaBeli,
					hargaBeliSatuan,

					jenisDiskon1,
					jenisDiskon2,
					jenisDiskon3,
					jenisDiskon4,
					jenisDiskon5,

					diskonPersen1,
					diskonPersen2,
					diskonPersen3,
					diskonPersen4,
					diskonPersen5,

					diskonHarga1,
					diskonHarga2,
					diskonHarga3,
					diskonHarga4,
					diskonHarga5,

					ppnPersen,
					ppnHarga,
						
					hargaModal,
					hargaBruto,
					hargaNetto,
					hargaJual,
					hargaJualMember,
						
					profitJual,
					profitJualMember,
						
					minimumJlh1,
					minimumJlh2,
					minimumJlh3,
						
					minimumHarga1,
					minimumHarga2,
					minimumHarga3,
						
					minimumPersen1,
					minimumPersen2,
					minimumPersen3,
						
					kartonJlh,
					kartonHarga,
					kartonPersen,

					createdAt: new Date(),
					createdBy: Meteor.user().username,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				OrderPembelianDetailCollections.insert(insertData);

				//if (productID) {
				//	ProductsPriceHistoriesCollections.insert({
				//		price,
				//		productID,
				//		createdAt: new Date(),
				//		createdBy: Meteor.user().username,
				//	});
				//}

				addLog(this, {
					type: 'ADD',
					module: 'PEMBELIAN DETAIL',
					title: 'Add Pembelian Detail',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Pembelian Detail Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembeliandetail.add',
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
		'orderpembeliandetail.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let _id = data.selectedID;
				let noFaktur = data.noFaktur;
				
				let itemNo	= Number(data.itemNo);
				let kodeBarang = data.kodeBarang;
				let barcode = data.barcode;
				let namaBarang = data.namaBarang;
				let categoryID = data.categoryID;

				let ktsBesar = Number(data.ktsBesar);
				let ktsKecil = Number(data.ktsKecil);
				let satuanBesar = data.satuanBesar;
				let satuanKecil = data.satuanKecil;
				let qtyBonus = data.qtyBonus;

				let hargaBeli = Number(data.hargaBeli.toString().split(',').join(''));
				let hargaBeliSatuan = Number(data.hargaBeliSatuan.toString().split(',').join(''));

				let jenisDiskon1 = data.jenisDiskon1;
				let jenisDiskon2 = data.jenisDiskon2;
				let jenisDiskon3 = data.jenisDiskon3;
				let jenisDiskon4 = data.jenisDiskon4;
				let jenisDiskon5 = data.jenisDiskon5;

				let diskonPersen1 = Number(data.diskonPersen1.toString().split(',').join(''));
				let diskonPersen2 = Number(data.diskonPersen2.toString().split(',').join(''));
				let diskonPersen3 = Number(data.diskonPersen3.toString().split(',').join(''));
				let diskonPersen4 = Number(data.diskonPersen4.toString().split(',').join(''));
				let diskonPersen5 = Number(data.diskonPersen5.toString().split(',').join(''));

				let diskonHarga1 = Number(data.diskonHarga1.toString().split(',').join(''));
				let diskonHarga2 = Number(data.diskonHarga2.toString().split(',').join(''));
				let diskonHarga3 = Number(data.diskonHarga3.toString().split(',').join(''));
				let diskonHarga4 = Number(data.diskonHarga4.toString().split(',').join(''));
				let diskonHarga5 = Number(data.diskonHarga5.toString().split(',').join(''));

				let ppnPersen = Number(data.ppnPersen.toString().split(',').join(''));
				let ppnHarga = Number(data.ppnHarga.toString().split(',').join(''));

				let hargaModal = Number(data.hargaModal.toString().split(',').join(''));
				let hargaBruto = Number(data.hargaBruto.toString().split(',').join(''));
				let hargaNetto = Number(data.hargaNetto.toString().split(',').join(''));

				let hargaJual = Number(data.hargaJual.toString().split(',').join(''));
				let profitJual = Number(data.profitJual.toString().split(',').join(''));
				let hargaJualMember = Number(data.hargaJualMember.toString().split(',').join(''));
				let profitJualMember = Number(data.profitJualMember.toString().split(',').join(''));

				let minimumJlh1 = Number(data.minimumJlh1.toString().split(',').join(''));
				let minimumJlh2 = Number(data.minimumJlh2.toString().split(',').join(''));
				let minimumJlh3 = Number(data.minimumJlh3.toString().split(',').join(''));
				let minimumHarga1 = Number(data.minimumHarga1.toString().split(',').join(''));
				let minimumHarga2 = Number(data.minimumHarga2.toString().split(',').join(''));
				let minimumHarga3 = Number(data.minimumHarga3.toString().split(',').join(''));
				let minimumPersen1 = Number(data.minimumPersen1.toString().split(',').join(''));
				let minimumPersen2 = Number(data.minimumPersen2.toString().split(',').join(''));
				let minimumPersen3 = Number(data.minimumPersen3.toString().split(',').join(''));

				let kartonJlh = Number(data.kartonJlh.toString().split(',').join(''));
				let kartonHarga = Number(data.kartonHarga.toString().split(',').join(''));
				let kartonPersen = Number(data.kartonPersen.toString().split(',').join(''));
				
				
				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Produk tidak ditemukan';
					return returnData;
				}
				if ( !kodeBarang ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Kode Barang !';
					return returnData;
				}

				if ( !ktsKecil ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 
						'Silahkan isi Kuantitas Barang !';
					return returnData;
				}

				if ( !hargaBeliSatuan) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 
						'Silahkan isi Harga Beli Barang !';
					return returnData;
				}

				let currData = OrderPembelianDetailCollections.findOne({
					noFaktur, itemNo,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian Detail tidak ditemukan';
					return returnData;
				}

				if (currData.kodeBarang !== kodeBarang) {
					let countExist = OrderPembelianDetailCollections.find({
						kodeBarang,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'PembelianDetail sudah ada di Sistem';
						return returnData;
					}
				}

				if (categoryID) {
					let isExist = CategoriesCollections.find({
						code: categoryID,
					}).fetch();
					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Kategori tidak ditemukan';
						return returnData;
					}
				}

				let updateData = {
					itemNo,
					noFaktur,

					kodeBarang,
					barcode,
					namaBarang,
					categoryID,

					ktsBesar,
					ktsKecil,
					satuanBesar,
				 	satuanKecil,
					qtyBonus,
					hargaBeli,
					hargaBeliSatuan,

					jenisDiskon1,
					jenisDiskon2,
					jenisDiskon3,
					jenisDiskon4,
					jenisDiskon5,

					diskonPersen1,
					diskonPersen2,
					diskonPersen3,
					diskonPersen4,
					diskonPersen5,

					diskonHarga1,
					diskonHarga2,
					diskonHarga3,
					diskonHarga4,
					diskonHarga5,

					ppnPersen,
					ppnHarga,
						
					hargaModal,
					hargaBruto,
					hargaNetto,
					hargaJual,
					hargaJualMember,
						
					profitJual,
					profitJualMember,
						
					minimumJlh1,
					minimumJlh2,
					minimumJlh3,
						
					minimumHarga1,
					minimumHarga2,
					minimumHarga3,
						
					minimumPersen1,
					minimumPersen2,
					minimumPersen3,
						
					kartonJlh,
					kartonHarga,
					kartonPersen,

					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				OrderPembelianDetailCollections.update({ _id }, { $set: updateData });

				//if (_id) {
				//	if (currData.price !== price) {
				//		ProductsPriceHistoriesCollections.insert({
				//			price,
				//			productID,
				//			createdAt: new Date(),
				//			createdBy: Meteor.user().username,
				//		});
				//	}
				//}

				addLog(this, {
					type: 'EDIT',
					module: 'PEMBELIAN DETAIL',
					title: 'Edit Pembelian Detail',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Pembelian Detail Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembeliandetail.add',
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
		'orderpembeliandetail.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = OrderPembelianDetailCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Pembelian Detail tidak ditemukan';
					return returnData;
				}

				OrderPembelianDetailCollections.remove({ _id });
				//ProductsPriceHistoriesCollections.remove({ productID: _id });

				addLog(this, {
					type: 'DELETE',
					module: 'PEMBELIAN DETAIL',
					title: 'Delete Pembelian Detail',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Pembelian Detail Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.orderpembeliandetail.delete',
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
