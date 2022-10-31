import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { AccountsCollections } from '../../db/Accounts';
import { TaxCodesCollections } from '../../db/TaxCodes';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'taxCodes.add'(data) {
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
				let name = data.name;
				let code = data.code;
				let amount = Number(data.amount);
				let purchaseAccountID = data.purchaseAccountID;
				let sellAccountID = data.sellAccountID;

				if (!name || !code || !purchaseAccountID || !sellAccountID) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama, Kode, Nomor Perkiraan Pajak Beli dan Pajak Jual Wajib diisi';
					return returnData;
				}

				let countExist = TaxCodesCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Kode Pajak Sudah ada di Sistem';
					return returnData;
				}

				let countPurchaseID = AccountsCollections.find({
					_id: purchaseAccountID,
				}).count();

				if (countPurchaseID === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nomor Perkiraan Pajak Beli tidak ditemukan';
					return returnData;
				}

				let countSellID = AccountsCollections.find({
					_id: sellAccountID,
				}).count();

				if (countSellID === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nomor Perkiraan Pajak Jual tidak ditemukan';
					return returnData;
				}

				let insertData = {
					name,
					code,
					amount,
					purchaseAccountID,
					sellAccountID,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};

				TaxCodesCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'TAXCODES',
					title: 'Add TaxCode ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Kode Pajak Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.taxCodes.add',
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
		'taxCodes.edit'(data) {
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
				let _id = data._id;
				let name = data.name;
				let code = data.code;
				let amount = Number(data.amount);
				let purchaseAccountID = data.purchaseAccountID;
				let sellAccountID = data.sellAccountID;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kode Pajak tidak ditemukan';
					return returnData;
				}
				if (!name || !code || !purchaseAccountID || !sellAccountID) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama, Kode, Nomor Perkiraan Pajak Beli dan Pajak Jual Wajib diisi';
					return returnData;
				}

				let currData = TaxCodesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kode Pajak tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = TaxCodesCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Kode Pajak Sudah ada di Sistem';
						return returnData;
					}
				}
				let countPurchaseID = AccountsCollections.find({
					_id: purchaseAccountID,
				}).count();

				if (countPurchaseID === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nomor Perkiraan Pajak Beli tidak ditemukan';
					return returnData;
				}

				let countSellID = AccountsCollections.find({
					_id: sellAccountID,
				}).count();

				if (countSellID === 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nomor Perkiraan Pajak Jual tidak ditemukan';
					return returnData;
				}


				let updateData = {
					code,
					name,
					amount,
					purchaseAccountID,
					sellAccountID,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				TaxCodesCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'TAXCODES',
					title: 'Edit TaxCode ',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Kode Pajak Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.taxCodes.add',
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
		'taxCodes.delete'(data) {
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
				let _id = data._id;

				let currData = TaxCodesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kode Pajak tidak ditemukan';
					return returnData;
				}

				TaxCodesCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'TAXCODES',
					title: 'Delete TaxCode ',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Kode Pajak Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.taxCodes.add',
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
