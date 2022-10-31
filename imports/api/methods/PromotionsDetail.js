import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PromotionsDetailCollections } from '../../db/PromotionsDetail';
import { CategoriesCollections } from '../../db/Categories';

import { addErrorLog, addLog } from './Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'promotionsdetail.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let promoNo = data.promoNo;
				let itemNo	= Number(data.itemNum);

				let kodeBarang = data.kodeBarang;
				let barcode = data.barcode;
				let namaBarang = data.namaBarang;
				let categoryID = data.categoryID;
				let supplierID = data.supplierID;

				let diskonPersen = Number(data.diskonPersen.toString().split(',').join(''));
				let diskonHarga = Number(data.diskonHarga.toString().split(',').join(''));

				if ( !kodeBarang ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Kode Barang !';
					return returnData;
				}

				let countExist = PromotionsDetailCollections.find({
					promoNo, itemNo
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Promotions Detail Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					promoNo,
					itemNo,
					
					kodeBarang,
					barcode,
					namaBarang,
					categoryID,
					supplierID,

					diskonPersen,
					diskonHarga,

					createdAt: new Date(),
					createdBy: Meteor.user().username,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PromotionsDetailCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'PROMOTIONS DETAIL',
					title: 'Add Promotions Detail',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Promotions Detail Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.promotionsdetail.add',
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
		'promotionsdetail.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let _id = data.selectedID;
				let promoNo = data.promoNo;
				let itemNo	= Number(data.itemNum);

				let kodeBarang = data.kodeBarang;
				let barcode = data.barcode;
				let namaBarang = data.namaBarang;
				let categoryID = data.categoryID;
				let supplierID = data.supplierID;

				let diskonPersen = Number(data.diskonPersen.toString().split(',').join(''));
				let diskonHarga = Number(data.diskonHarga.toString().split(',').join(''));
				
				
				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Promotions Detail tidak ditemukan';
					return returnData;
				}

				if ( !kodeBarang ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Kode Barang !';
					return returnData;
				}

				let currData = PromotionsDetailCollections.findOne({
					promoNo, itemNo,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Promotions Detail tidak ditemukan';
					return returnData;
				}

				if (currData.kodeBarang !== kodeBarang) {
					let countExist = PromotionsDetailCollections.find({
						kodeBarang,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'PromotionsDetail sudah ada di Sistem';
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
					promoNo,
					itemNo,
					
					kodeBarang,
					barcode,
					namaBarang,
					categoryID,
					supplierID,
					
					diskonPersen,
					diskonHarga,

					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PromotionsDetailCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'PROMOTIONS DETAIL',
					title: 'Edit Promotions Detail',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Promotions Detail Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.promotionsdetail.add',
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
		'promotionsdetail.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = PromotionsDetailCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Promotions Detail tidak ditemukan';
					return returnData;
				}

				PromotionsDetailCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'PROMOTIONS DETAIL',
					title: 'Delete Promotions Detail',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Promotions Detail Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.promotionsdetail.delete',
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
