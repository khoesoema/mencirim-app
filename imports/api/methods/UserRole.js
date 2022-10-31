import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { UserRoleCollections } from '../../db/UserRole';
import { addErrorLog, addLog } from './Logs';
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
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi id dan deskripsi user role';
					return returnData;
				}

				let countExist = UserRoleCollections.find({
					roleid,
				}).count();

				if (countExist > 0) {
					returnData.roleid = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'User Role Sudah ada di Sistem';
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
				let errorroleid = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.userrole.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error roleid = ' +
						errorroleid
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
					returnData.roleid = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data User Role tidak ditemukan';
					return returnData;
				}
				if (!roleid || !roledesc) {
					returnData.roleid = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama User Role';
					return returnData;
				}

				let currData = UserRoleCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.roleid = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data User Role tidak ditemukan';
					return returnData;
				}

				if (currData.roleid !== roleid) {
					let countExist = UserRoleCollections.find({
						roleid,
					}).count();

					if (countExist > 0) {
						returnData.roleid = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'User Role Sudah ada di Sistem';
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
				returnData.message = 'Data User Role Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorroleid = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.userrole.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error roleid = ' +
						errorroleid
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
					returnData.roleid = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data User Role tidak ditemukan';
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
				returnData.message = 'Data User Role Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorroleid = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.userrole.add',
					tryErr.message
				);
				throw new Meteor.Error(
					'Unexpected Error',
					'An Error Occured While Processing Your Request, Please Report to Our Customer Service Immediately. Error roleid = ' +
						errorroleid
				);
			} finally {
			}
		},
	});
}
