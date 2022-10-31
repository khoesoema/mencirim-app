import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PenjualanDetailCollections } from '../../db/PenjualanDetail';
import { CategoriesCollections } from '../../db/Categories';
import { UOMCollections } from '../../db/UOM';
import { addErrorLog, addLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'penjualandetail.add'(data) {
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

				let jenisDiskon1 = data.jenisDiskon1;
				let diskonPersen1 = Number(data.diskonPersen1.toString().split(',').join(''));
				let diskonHarga1 = Number(data.diskonHarga1.toString().split(',').join(''));

				let ppnPersen = Number(data.ppnPersen.toString().split(',').join(''));
				let ppnHarga = Number(data.ppnHarga.toString().split(',').join(''));

				let hargaBruto = Number(data.hargaBruto.toString().split(',').join(''));
				let hargaNetto = Number(data.hargaNetto.toString().split(',').join(''));

				let hargaJual = Number(data.hargaJual.toString().split(',').join(''));
				let profitJual = 0;

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

				let countExist = PenjualanDetailCollections.find({
					noFaktur, itemNo
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Detail Sudah ada di Sistem';
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

					jenisDiskon1,
					diskonPersen1,
					diskonHarga1,

					ppnPersen,
					ppnHarga,
						
					hargaBruto,
					hargaNetto,

					hargaJual,
					profitJual,

					createdAt: new Date(),
					createdBy: Meteor.user().username,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PenjualanDetailCollections.insert(insertData);

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
					module: 'PENJUALAN DETAIL',
					title: 'Add Penjualan Detail',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan Detail Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualandetail.add',
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
		'penjualandetail.edit'(data) {
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

				let jenisDiskon1 = data.jenisDiskon1;
				let diskonPersen1 = Number(data.diskonPersen1.toString().split(',').join(''));
				let diskonHarga1 = Number(data.diskonHarga1.toString().split(',').join(''));

				let ppnPersen = Number(data.ppnPersen.toString().split(',').join(''));
				let ppnHarga = Number(data.ppnHarga.toString().split(',').join(''));

				let hargaBruto = Number(data.hargaBruto.toString().split(',').join(''));
				let hargaNetto = Number(data.hargaNetto.toString().split(',').join(''));

				let hargaJual = Number(data.hargaJual.toString().split(',').join(''));
				let profitJual = 0;

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

				let currData = PenjualanDetailCollections.findOne({
					noFaktur, itemNo,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Detail tidak ditemukan';
					return returnData;
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

					jenisDiskon1,
					diskonPersen1,
					diskonHarga1,

					ppnPersen,
					ppnHarga,

					hargaBruto,
					hargaNetto,
					hargaJual,
					profitJual,

					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PenjualanDetailCollections.update({ _id }, { $set: updateData });

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
					module: 'PENJUALAN DETAIL',
					title: 'Edit Penjualan Detail',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan Detail Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualandetail.add',
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
		'penjualandetail.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = PenjualanDetailCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Penjualan Detail tidak ditemukan';
					return returnData;
				}

				PenjualanDetailCollections.remove({ _id });
				//ProductsPriceHistoriesCollections.remove({ productID: _id });

				addLog(this, {
					type: 'DELETE',
					module: 'PENJUALAN DETAIL',
					title: 'Delete Penjualan Detail',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Penjualan Detail Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.penjualandetail.delete',
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
