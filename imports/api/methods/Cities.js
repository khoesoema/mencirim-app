import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CitiesCollections } from '../../db/Cities';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'cities.add'(data) {
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
					returnData.message = 'Silahkan isi Kode dan Nama Kota';
					return returnData;
				}

				let countExist = CitiesCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Kota Sudah ada di Sistem';
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

				CitiesCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'CITIES',
					title: 'Add City',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Kota Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.cities.add',
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
		'cities.edit'(data) {
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
					returnData.message = 'Data Kota tidak ditemukan';
					return returnData;
				}
				if (!name || !code) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama Kota';
					return returnData;
				}

				let currData = CitiesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kota tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = CitiesCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Kota Sudah ada di Sistem';
						return returnData;
					}
				}

				let updateData = {
					code,
					name,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				CitiesCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'CITIES',
					title: 'Edit City',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Kota Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.cities.edit',
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
		'cities.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;

				let currData = CitiesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Kota tidak ditemukan';
					return returnData;
				}

				CitiesCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'CITIES',
					title: 'Delete City',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Kota Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.cities.edit',
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
