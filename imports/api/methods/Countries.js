import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CountriesCollections } from '../../db/Countries';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'countries.add'(data) {
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
					returnData.message = 'Silahkan isi Kode dan Nama Negara';
					return returnData;
				}

				let countExist = CountriesCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Negara Sudah ada di Sistem';
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

				CountriesCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'COUNTRIES',
					title: 'Add Country',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Negara Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.countries.add',
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
		'countries.edit'(data) {
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
					returnData.message = 'Data Negara tidak ditemukan';
					return returnData;
				}
				if (!name || !code) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama Negara';
					return returnData;
				}

				let currData = CountriesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Negara tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = CountriesCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Negara Sudah ada di Sistem';
						return returnData;
					}
				}

				let updateData = {
					code,
					name,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				CountriesCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'COUNTRIES',
					title: 'Edit Country',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Negara Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.countries.edit',
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
		'countries.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = CountriesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Negara tidak ditemukan';
					return returnData;
				}

				CountriesCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'COUNTRIES',
					title: 'Delete Country',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Negara Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.countries.edit',
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
