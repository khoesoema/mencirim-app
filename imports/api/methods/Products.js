import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { CategoriesCollections } from '../../db/Categories';
import { ProductsCollections, ProductsPriceHistoriesCollections } from '../../db/Products';
import { UOMCollections } from '../../db/UOM';
import { addErrorLog, addLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'products.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let kodeBarang = data.kodeBarang;
				let barcode = data.barcode;
				let namaBarang = data.namaBarang;
				let imageBase64 = data.imageBase64;
				let categoryID = data.categoryID;
				let kts = Number(data.kts);
				let satuanBesar = data.satuanBesar;
				let satuanKecil = data.satuanKecil;
				let qty = data.qty;
				let supplier = data.supplier;
				let hargabeli = Number(data.hargabeli);
				let hargabelisatuan = Number(data.hargabelisatuan);
				let jenisdiskon1 = data.jenisdiskon1;
				let jenisdiskon2 = data.jenisdiskon2;
				let jenisdiskon3 = data.jenisdiskon3;
				let jenisdiskon4 = data.jenisdiskon4;
				let jenisdiskon5 = data.jenisdiskon5;
				let diskonpersen1 = Number(data.diskonpersen1);
				let diskonpersen2 = Number(data.diskonpersen2);
				let diskonpersen3 = Number(data.diskonpersen3);
				let diskonpersen4 = Number(data.diskonpersen4);
				let diskonpersen5 = Number(data.diskonpersen5);
				let diskonharga1 = Number(data.diskonharga1);
				let diskonharga2 = Number(data.diskonharga2);
				let diskonharga3 = Number(data.diskonharga3);
				let diskonharga4 = Number(data.diskonharga4);
				let diskonharga5 = Number(data.diskonharga5);
				let ppnpersen = Number(data.ppnpersen);
				let ppnharga = Number(data.ppnharga);
				let hargamodal = Number(data.hargamodal);
				let tglLastTrx = moment(data.tglLastTrx).toDate();
				let buktiFaktur = data.buktiFaktur;
				let hargajual = Number(data.hargajual);
				let profitjual = Number(data.profitjual);
				let hargajualmember = Number(data.hargajualmember);
				let profitjualmember = Number(data.profitjualmember);
				let minimumjlh1 = Number(data.minimumjlh1);
				let minimumjlh2 = Number(data.minimumjlh2);
				let minimumjlh3 = Number(data.minimumjlh3);
				let minimumharga1 = Number(data.minimumharga1);
				let minimumharga2 = Number(data.minimumharga2);
				let minimumharga3 = Number(data.minimumharga3);
				let minimumpersen1 = Number(data.minimumpersen1);
				let minimumpersen2 = Number(data.minimumpersen2);
				let minimumpersen3 = Number(data.minimumpersen3);
				let kartonjlh = Number(data.kartonjlh);
				let kartonharga = Number(data.kartonharga);
				let kartonpersen = Number(data.kartonpersen);
				let batasMin = Number(data.batasMin);
				let batasMax = Number(data.batasMax);
				let minimumOrder = Number(data.minimumOrder);

				if (imageBase64) {
					const type = imageBase64.split(';')[0].split('/')[1];
					if (type !== 'png' && type !== 'jpeg' && type !== 'jpg') {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Format gambar yang diijinkan hanya PNG, JPEG/JPG';
						return returnData;
					}
				}

				if ( !kodeBarang || !namaBarang || !kts) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Kode Barang, Nama dan Kuantitas Produk';
					return returnData;
				}

				let countUOM = UOMCollections.find({
					code: satuanBesar,
				}).count();

				if (countUOM === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan Besar tidak ditemukan';
					return returnData;
				}

				let countExist = ProductsCollections.find({
					kodeBarang,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Produk Sudah ada di Sistem';
					return returnData;
				}

				if (categoryID) {
					let isExist = CategoriesCollections.find({
						_id: categoryID,
					}).fetch();
					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Kategori tidak ditemukan';
						return returnData;
					}
				}

				let insertData = {
					kodeBarang,
					barcode,
					namaBarang,
					categoryID,
					kts,
					satuanBesar,
					satuanKecil,
					qty,
					supplier,
					hargabeli,
					hargabelisatuan,
					jenisdiskon1,
					jenisdiskon2,
					jenisdiskon3,
					jenisdiskon4,
					jenisdiskon5,
					diskonpersen1,
					diskonpersen2,
					diskonpersen3,
					diskonpersen4,
					diskonpersen5,
					diskonharga1,
					diskonharga2,
					diskonharga3,
					diskonharga4,
					diskonharga5,
					ppnpersen,
					ppnharga,
					hargamodal,
					tglLastTrx,
					buktiFaktur,
					hargajual,
					profitjual,
					hargajualmember,
					profitjualmember,
					minimumjlh1,
					minimumjlh2,
					minimumjlh3,
					minimumharga1,
					minimumharga2,
					minimumharga3,
					minimumpersen1,
					minimumpersen2,
					minimumpersen3,
					kartonjlh,
					kartonharga,
					kartonpersen,
					batasMin,
					batasMax,
					minimumOrder,
					imageBase64,
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
					modifiedAt: new Date(),
					createdAt: new Date(),
				};

				ProductsCollections.insert(insertData);

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
					module: 'PRODUCTS',
					title: 'Add Product ',
					description: JSON.stringify(insertData),
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
					'method.products.add',
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
		'products.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let _id = data._id;
				let kodeBarang = data.kodeBarang;
				let barcode = data.barcode;
				let namaBarang = data.namaBarang;
				let imageBase64 = data.imageBase64;
				let categoryID = data.categoryID;
				let kts = Number(data.kts);
				let satuanBesar = data.satuanBesar;
				let satuanKecil = data.satuanKecil;
				let supplier = data.supplier;
				let hargabeli = Number(data.hargabeli);
				let hargabelisatuan = Number(data.hargabelisatuan);
				let jenisdiskon1 = data.jenisdiskon1;
				let jenisdiskon2 = data.jenisdiskon2;
				let jenisdiskon3 = data.jenisdiskon3;
				let jenisdiskon4 = data.jenisdiskon4;
				let jenisdiskon5 = data.jenisdiskon5;
				let diskonpersen1 = Number(data.diskonpersen1);
				let diskonpersen2 = Number(data.diskonpersen2);
				let diskonpersen3 = Number(data.diskonpersen3);
				let diskonpersen4 = Number(data.diskonpersen4);
				let diskonpersen5 = Number(data.diskonpersen5);
				let diskonharga1 = Number(data.diskonharga1);
				let diskonharga2 = Number(data.diskonharga2);
				let diskonharga3 = Number(data.diskonharga3);
				let diskonharga4 = Number(data.diskonharga4);
				let diskonharga5 = Number(data.diskonharga5);
				let ppnpersen = Number(data.ppnpersen);
				let ppnharga = Number(data.ppnharga);
				let hargamodal = Number(data.hargamodal);
				let tglLastTrx = moment(data.tglLastTrx).toDate();
				let buktiFaktur = data.buktiFaktur;
				let hargajual = Number(data.hargajual);
				let profitjual = Number(data.profitjual);
				let hargajualmember = Number(data.hargajualmember);
				let profitjualmember = Number(data.profitjualmember);
				let minimumjlh1 = Number(data.minimumjlh1);
				let minimumjlh2 = Number(data.minimumjlh2);
				let minimumjlh3 = Number(data.minimumjlh3);
				let minimumharga1 = Number(data.minimumharga1);
				let minimumharga2 = Number(data.minimumharga2);
				let minimumharga3 = Number(data.minimumharga3);
				let minimumpersen1 = Number(data.minimumpersen1);
				let minimumpersen2 = Number(data.minimumpersen2);
				let minimumpersen3 = Number(data.minimumpersen3);
				let kartonjlh = Number(data.kartonjlh);
				let kartonharga = Number(data.kartonharga);
				let kartonpersen = Number(data.kartonpersen);
				let batasMin = Number(data.batasMin);
				let batasMax = Number(data.batasMax);
				let minimumOrder = Number(data.minimumOrder);
				
				if (imageBase64) {
					const type = imageBase64.split(';')[0].split('/')[1];
					if (type !== 'png' && type !== 'jpeg' && type !== 'jpg') {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Format gambar yang diijinkan hanya PNG, JPEG/JPG';
						return returnData;
					}
				}
				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Produk tidak ditemukan';
					return returnData;
				}
				if (!namaBarang || !kodeBarang || !kts) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Kode, Nama dan Kuantitas Produk';
					return returnData;
				}

				let countUOM = UOMCollections.find({
					code: satuanBesar,
				}).count();

				if (countUOM === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan Besar tidak ditemukan';
					return returnData;
				}

				let currData = ProductsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Produk tidak ditemukan';
					return returnData;
				}

				if (!imageBase64) {
					imageBase64 = currData.imageBase64;
				}

				if (currData.kodeBarang !== kodeBarang) {
					let countExist = ProductsCollections.find({
						kodeBarang,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Produk sudah ada di Sistem';
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
					kodeBarang,
					barcode,
					namaBarang,
					categoryID,
					kts,
					satuanBesar,
					satuanKecil,
					supplier,
					hargabeli,
					hargabelisatuan,
					jenisdiskon1,
					jenisdiskon2,
					jenisdiskon3,
					jenisdiskon4,
					jenisdiskon5,
					diskonpersen1,
					diskonpersen2,
					diskonpersen3,
					diskonpersen4,
					diskonpersen5,
					diskonharga1,
					diskonharga2,
					diskonharga3,
					diskonharga4,
					diskonharga5,
					ppnpersen,
					ppnharga,
					hargamodal,
					tglLastTrx,
					buktiFaktur,
					hargajual,
					profitjual,
					hargajualmember,
					profitjualmember,
					minimumjlh1,
					minimumjlh2,
					minimumjlh3,
					minimumharga1,
					minimumharga2,
					minimumharga3,
					minimumpersen1,
					minimumpersen2,
					minimumpersen3,
					kartonjlh,
					kartonharga,
					kartonpersen,
					batasMin,
					batasMax,
					minimumOrder,
					imageBase64,
					modifiedBy: Meteor.user().username,
					modifiedAt: new Date(),
				};

				ProductsCollections.update({ _id }, { $set: updateData });

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
					module: 'PRODUCTS',
					title: 'Edit Product',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Produk Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.products.add',
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
		'products.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = ProductsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Produk tidak ditemukan';
					return returnData;
				}

				ProductsCollections.remove({ _id });
				ProductsPriceHistoriesCollections.remove({ productID: _id });

				addLog(this, {
					type: 'DELETE',
					module: 'PRODUCTS',
					title: 'Delete Product ',
					description: JSON.stringify(currData),
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
					'method.products.add',
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
		'products.deleteImage'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = ProductsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Produk tidak ditemukan';
					return returnData;
				}

				ProductsCollections.update(
					{ _id },
					{
						$set: {
							imageBase64: '',
						},
					}
				);

				addLog(this, {
					type: 'DELETE',
					module: 'PRODUCTS_IMAGES',
					title: 'Delete Product Image',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Gambar Produk Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.products.add',
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
