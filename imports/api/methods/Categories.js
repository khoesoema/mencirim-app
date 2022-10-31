import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CategoriesCollections } from '../../db/Categories';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'categories.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let name = data.name;
				let code = data.code;

				if (!name || !code) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama Kategori';
					return returnData;
				}

				let countExist = CategoriesCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Kategori Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					code,
					name,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};

				CategoriesCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'CATEGORIES',
					title: 'Add Category ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Kategori Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.categories.add',
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
		'categories.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let name = data.name;
				let code = data.code;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kategori tidak ditemukan';
					return returnData;
				}
				if (!name || !code) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama Kategori';
					return returnData;
				}

				let currData = CategoriesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kategori tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = CategoriesCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Kategori Sudah ada di Sistem';
						return returnData;
					}
				}

				let updateData = {
					code,
					name,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				CategoriesCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'CATEGORIES',
					title: 'Edit Category ',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Kategori Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.categories.edit',
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
		'categories.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = CategoriesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kategori tidak ditemukan';
					return returnData;
				}

				CategoriesCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'CATEGORIES',
					title: 'Delete Category ',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Kategori Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.categories.edit',
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
