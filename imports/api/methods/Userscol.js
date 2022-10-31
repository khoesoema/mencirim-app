import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { DataUsersCollections } from '../../db/Userscol';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'Users.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let username = data.username;
				let name = data.name;
				let password = data.password;
				let roleID = data.roleID;

				if (!username || !name) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama User';
					return returnData;
				}

				let countExist = DataUsersCollections.find({
					username,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'User Sudah ada di Sistem';
					return returnData;
				}
				
				let insertData = {
					username,
					name,
					roleID,
					createdAt: new Date(),
				};

				//DataUsersCollections.insert(insertData);

				Accounts.createUser({
					username: username,
					password: password,
				});
				
				let updateData = {
					name,
					roleID,
					createdAt: new Date(),
				};

				DataUsersCollections.update({ username }, { $set: updateData });

				addLog(this, {
					type: 'ADD',
					module: 'Users',
					title: 'Add Users',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data User Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.datauser.add',
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
		'datauser.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let username = data.username;
				let name = data.name;
				let roleID = data.roleID;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data User tidak ditemukan';
					return returnData;
				}
				if (!username || !name) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi username dan Nama User';
					return returnData;
				}

				let currData = DataUsersCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data User tidak ditemukan';
					return returnData;
				}

				if (currData.username !== username) {
					let countExist = DataUsersCollections.find({
						username,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'User Sudah ada di Sistem';
						return returnData;
					}
				}

				let updateData = {
					username,
					name,
					roleID,
				};

				DataUsersCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'Users',
					title: 'Edit User',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data User Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.datauser.edit',
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
		'dataUser.delete'(data) {
			let returnData = {
				username: 200,
				title: '',
				message: '',
			};

			try {

				let _id = data._id;

				let currData = DataUsersCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data User tidak ditemukan';
					return returnData;
				}

				DataUsersCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'Users',
					title: 'Delete User',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data User Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.datauser.delete',
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
