import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { AccountsCollections } from '../../db/Accounts';
import { CurrenciesCollections } from '../../db/Currencies';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'accounts.add'(data) {
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
				let balanceType = data.balanceType;
				let accountType = data.accountType;
				let accountSubType = data.accountSubType;
				let isGeneral = data.isGeneral;
				let currencyID = data.currencyID;
				let parentID = data.parentID;
				let initialBalance = data.initialBalance;

				if (
					!name ||
					!code ||
					(balanceType !== 0 && balanceType !== 1) ||
					(accountType !== 0 && accountType !== 1) ||
					!currencyID
				) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama dan Nomor Perkiraan serta Saldo Normal, Jenis Perkiraan dan Mata Uang Wajib Diisi';
					return returnData;
				}
				if (isGeneral === 0 && !accountSubType) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Kelompok Perkiraan Wajib Diisi';
					return returnData;
				}

				let countExist = AccountsCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Nomor Perkiraan Sudah ada di Sistem';
					return returnData;
				}

				if (currencyID) {
					let isExist = CurrenciesCollections.find({
						_id: currencyID,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Mata Uang tidak ditemukan';
						return returnData;
					}
				}

				if (parentID) {
					let isExist = AccountsCollections.find({
						_id: parentID,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Data Perkiraan GL tidak ditemukan';
						return returnData;
					}

					AccountsCollections.update(
						{
							_id: parentID,
						},
						{
							$set: {
								hasChild: 1,
							},
						}
					);
				}

				let insertData = {
					name,
					code,
					balanceType,
					accountType,
					accountSubType,
					isGeneral,
					currencyID,
					parentID,
					initialBalance,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};

				AccountsCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'ACCOUNTS',
					title: 'Add Account ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Nomor Perkiraan Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.accounts.add',
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
		'accounts.edit'(data) {
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
				let balanceType = data.balanceType;
				let accountType = data.accountType;
				let accountSubType = data.accountSubType;
				let isGeneral = data.isGeneral;
				let currencyID = data.currencyID;
				let parentID = data.parentID;
				let initialBalance = data.initialBalance;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Nomor Perkiraan tidak ditemukan';
					return returnData;
				}

				if (
					!name ||
					!code ||
					(balanceType !== 0 && balanceType !== 1) ||
					(accountType !== 0 && accountType !== 1) ||
					!currencyID
				) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama dan Nomor Perkiraan serta Saldo Normal, Jenis Perkiraan dan Mata Uang Wajib Diisi';
					return returnData;
				}
				if (isGeneral === 0 && !accountSubType) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Kelompok Perkiraan Wajib Diisi';
					return returnData;
				}

				if (currencyID) {
					let isExist = CurrenciesCollections.find({
						_id: currencyID,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Mata Uang tidak ditemukan';
						return returnData;
					}
				}

				let currData = AccountsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Nomor Perkiraan tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = AccountsCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Nomor Perkiraan Sudah ada di Sistem';
						return returnData;
					}
				}

				if (parentID) {
					let isExist = AccountsCollections.find({
						_id: parentID,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Data Perkiraan GL tidak ditemukan';
						return returnData;
					}

					AccountsCollections.update(
						{
							_id: parentID,
						},
						{
							$set: {
								hasChild: 1,
							},
						}
					);
				}

				let updateData = {
					name,
					code,
					balanceType,
					accountType,
					accountSubType,
					isGeneral,
					currencyID,
					parentID,
					initialBalance,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				AccountsCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'ACCOUNTS',
					title: 'Edit Account ',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Nomor Perkiraan Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.accounts.add',
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
		'accounts.delete'(data) {
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

				let currData = AccountsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Nomor Perkiraan tidak ditemukan';
					return returnData;
				}

				if (currData.parentID) {
					let countChild = AccountsCollections.find({
						parentID: currData.parentID,
					}).count();
					if (countChild > 0) {
						AccountsCollections.update(
							{
								_id: currData.parentID,
							},
							{
								$set: {
									hasChild: 1,
								},
							}
						);
					} else {
						AccountsCollections.update(
							{
								_id: currData.parentID,
							},
							{
								$set: {
									hasChild: 0,
								},
							}
						);
					}
				}

				AccountsCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'ACCOUNTS',
					title: 'Delete Account ',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Nomor Perkiraan Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.accounts.add',
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
