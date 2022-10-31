import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { BusinessTypesCollections } from '../../db/BusinessTypes';
import { CitiesCollections } from '../../db/Cities';
import { CompaniesCollections } from '../../db/Companies';
import { CountriesCollections } from '../../db/Countries';
import { StatesCollections } from '../../db/States';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'companies.add'(data) {
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
				let businessTypeID = data.businessTypeID;
				let primaryContactName = data.primaryContactName;
				let address = data.address;
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;
				let countryCode = data.countryCode;
				let stateCode = data.stateCode;
				let cityName = data.cityName;
				let postalCode = data.postalCode;
				let NPWPNumber = data.NPWPNumber;
				let NPWPName = data.NPWPName;
				let NPWPAddress = data.NPWPAddress;

				if (!name || !code || !primaryContactName || !businessTypeID) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama, Kode, Kontak Utama, Tipe Bisnis Wajib Diisi';
					return returnData;
				}

				let countExist = CompaniesCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Perusahaan Sudah ada di Sistem';
					return returnData;
				}

				if (businessTypeID) {
					let isExist = BusinessTypesCollections.find({
						_id: businessTypeID,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Tipe Bisnis tidak ditemukan';
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

				let insertData = {
					name,
					code,
					businessTypeID,
					primaryContactName,
					address,
					phoneNumber,
					mobileNumber,
					countryCode,
					stateCode,
					cityName,
					postalCode,
					NPWPNumber,
					NPWPName,
					NPWPAddress,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};

				CompaniesCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'COMPANIES',
					title: 'Add Company ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Perusahaan Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.companies.add',
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
		'companies.edit'(data) {
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
				let businessTypeID = data.businessTypeID;
				let primaryContactName = data.primaryContactName;
				let address = data.address;
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;
				let countryCode = data.countryCode;
				let stateCode = data.stateCode;
				let cityName = data.cityName;
				let postalCode = data.postalCode;
				let NPWPNumber = data.NPWPNumber;
				let NPWPName = data.NPWPName;
				let NPWPAddress = data.NPWPAddress;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Perusahaan tidak ditemukan';
					return returnData;
				}
				if (!name || !code || !primaryContactName || !businessTypeID) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama, Kode, Kontak Utama, Tipe Bisnis Wajib Diisi';
					return returnData;
				}

				let currData = CompaniesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Perusahaan tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = CompaniesCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Perusahaan Sudah ada di Sistem';
						return returnData;
					}
				}

				if (businessTypeID) {
					let isExist = BusinessTypesCollections.find({
						_id: businessTypeID,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Tipe Bisnis tidak ditemukan';
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
					businessTypeID,
					primaryContactName,
					address,
					phoneNumber,
					mobileNumber,
					countryCode,
					stateCode,
					cityName,
					postalCode,
					NPWPNumber,
					NPWPName,
					NPWPAddress,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				CompaniesCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'COMPANIES',
					title: 'Edit Company ',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Perusahaan Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.companies.add',
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
		'companies.delete'(data) {
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

				let currData = CompaniesCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Perusahaan tidak ditemukan';
					return returnData;
				}

				CompaniesCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'COMPANIES',
					title: 'Delete Company ',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Perusahaan Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.companies.add',
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
