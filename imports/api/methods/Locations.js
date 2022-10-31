import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CitiesCollections } from '../../db/Cities';
import { CountriesCollections } from '../../db/Countries';
import { LocationsCollections } from '../../db/Locations';
import { StatesCollections } from '../../db/States';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'locations.add'(data) {
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
				let primaryContactName = data.primaryContactName;
				let address = data.address;
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;
				let countryCode = data.countryCode;
				let stateCode = data.stateCode;
				let cityName = data.cityName;
				let postalCode = data.postalCode;

				if (!name || !code || !primaryContactName) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Nama, Kode, Kontak Utama Wajib Diisi';
					return returnData;
				}

				let countExist = LocationsCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Lokasi Sudah ada di Sistem';
					return returnData;
				}

				if (countryCode) {
					let isExist = CountriesCollections.find({
						code: countryCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Negara tidak ditemukan';
						return returnData;
					}
				}

				if (stateCode && countryCode) {
					let isExist = StatesCollections.find({
						code: stateCode,
						countryCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Provinsi tidak ditemukan';
						return returnData;
					}
				}

				if (cityName && stateCode && countryCode) {
					let isExist = CitiesCollections.find({
						name: cityName,
						stateCode,
						countryCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Kota tidak ditemukan';
						return returnData;
					}
				}

				let insertData = {
					name,
					code,
					primaryContactName,
					address,
					phoneNumber,
					mobileNumber,
					countryCode,
					stateCode,
					cityName,
					postalCode,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};

				LocationsCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'LOCATIONS',
					title: 'Add Location ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Lokasi Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.locations.add',
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
		'locations.edit'(data) {
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
				let primaryContactName = data.primaryContactName;
				let address = data.address;
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;
				let countryCode = data.countryCode;
				let stateCode = data.stateCode;
				let cityName = data.cityName;
				let postalCode = data.postalCode;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Lokasi tidak ditemukan';
					return returnData;
				}
				if (!name || !code || !primaryContactName) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Nama, Kode, Kontak Utama Wajib Diisi';
					return returnData;
				}

				let currData = LocationsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Lokasi tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = LocationsCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Lokasi Sudah ada di Sistem';
						return returnData;
					}
				}

				if (countryCode) {
					let isExist = CountriesCollections.find({
						code: countryCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Negara tidak ditemukan';
						return returnData;
					}
				}

				if (stateCode && countryCode) {
					let isExist = StatesCollections.find({
						code: stateCode,
						countryCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Provinsi tidak ditemukan';
						return returnData;
					}
				}

				if (cityName && stateCode && countryCode) {
					let isExist = CitiesCollections.find({
						name: cityName,
						stateCode,
						countryCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Kota tidak ditemukan';
						return returnData;
					}
				}

				let updateData = {
					name,
					code,
					primaryContactName,
					address,
					phoneNumber,
					mobileNumber,
					countryCode,
					stateCode,
					cityName,
					postalCode,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				LocationsCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'LOCATIONS',
					title: 'Edit Location ',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Lokasi Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.locations.add',
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
		'locations.delete'(data) {
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

				let currData = LocationsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Lokasi tidak ditemukan';
					return returnData;
				}

				LocationsCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'LOCATIONS',
					title: 'Delete Location ',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Lokasi Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.locations.add',
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
