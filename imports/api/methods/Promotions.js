import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PromotionsCollections } from '../../db/Promotions';
import { PromotionsDetailCollections } from '../../db/PromotionsDetail';
import { addErrorLog, addLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'promotions.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let promoNo = data.promoNo;
				let startDate = data.startDate;
				let endDate = data.endDate;
				let target = Number(data.target);
				let keterangan = data.keterangan;

				if ( !promoNo ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi Nomor Promosi !';
					return returnData;
				}

				if ( !startDate ) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 
						'Silahkan isi tanggal Mulai Berlakunya Diskon ! ' ;
					return returnData;
				}

				let countExist = PromotionsCollections.find({
					promoNo
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Transaksi Promotions Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					promoNo,
                    startDate,
					endDate,
                    target,
					keterangan,
					createdAt: new Date(),
					createdBy: Meteor.user().username,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PromotionsCollections.insert(insertData);

				PromotionsDetailCollections.update( { 
					promoNo 
				}, { 
					$set: {
						startDate,
						endDate,
						target
					} 
				});

				addLog(this, {
					type: 'ADD',
					module: 'PROMOTIONS',
					title: 'Add Promotions',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Promotions  Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.promotions.add',
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
		'promotions.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let promoNo = data.promoNo;
				let startDate = data.startDate;
				let endDate = data.endDate;
				let target = Number(data.target);
				let keterangan = data.keterangan;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Promotions tidak ditemukan';
					return returnData;
				}
				if (!promoNo || !startDate) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Silahkan isi No Promosi dan Tanggal Promosi';
					return returnData;
				}

				let currData = PromotionsCollections.findOne({
					promoNo
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Promotions  tidak ditemukan';
					return returnData;
				}

				let updateData = {
					promoNo,
                    startDate,
					endDate,
                    target,
					keterangan,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				PromotionsCollections.update({ _id }, { $set: updateData });

				PromotionsDetailCollections.update( { 
						promoNo 
					}, { 
						$set: {
							startDate,
							endDate,
							target
						} 
				});

				addLog(this, {
					type: 'EDIT',
					module: 'PROMOTIONS',
					title: 'Edit Promotions',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Promotions Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.promotions.edit',
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
		'promotions.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let promoNo = data.promoNo;

				let currData = PromotionsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Promotions tidak ditemukan';
					return returnData;
				}

				PromotionsCollections.remove({ _id });
				PromotionsDetailCollections.remove({ promoNo });

				addLog(this, {
					type: 'DELETE',
					module: 'PROMOTIONS',
					title: 'Delete Promotions',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Promotions Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.promotions.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error Code = ' +
						errorCode
				);
			} finally {
			}
		}
	});
}
