import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { UserRoleCollections } from '../../db/UsersRole';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'UserRole.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let roleid = data.roleid;
				let roledesc = data.roledesc;

				if (!roleid || !roledesc) {
					returnData.roledesc = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi id dan deskripsi user role';
					return returnData;
				}

				let countExist = UserRoleCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Satuan Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					roleid,
					roledesc,
					createdAt: new Date(),
				};

				UserRoleCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'UserRole',
					title: 'Add UserRole ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'User Role Berhasil ditambahkan';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.userrole.add',
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
		'userrole.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let roleid = data.roleid;
				let roledesc = data.roledesc;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}
				if (!roleid || !roledesc) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama Satuan';
					return returnData;
				}

				let currData = UserRoleCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = UserRoleCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Satuan Sudah ada di Sistem';
						return returnData;
					}
				}

				let updateData = {
					roleid,
					roledesc,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().roleid,
				};

				UserRoleCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'UserRole',
					title: 'Edit UserRole ',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Satuan Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.userrole.add',
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
		'userrole.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let _id = data._id;

				let currData = UserRoleCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Satuan tidak ditemukan';
					return returnData;
				}

				UserRoleCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'UserRole',
					title: 'Delete UserRole ',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Satuan Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.userrole.add',
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
