import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { BusinessTypesCollections } from '../../db/BusinessTypes';
import { CitiesCollections } from '../../db/Cities';
import { CountriesCollections } from '../../db/Countries';
import { StatesCollections } from '../../db/States';
import { VendorsCollections } from '../../db/Vendors';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'vendors.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let name = data.name;
				let code = data.code;

				let businessTypeID = data.businessTypeID;
				let relasi = data.relasi;
				let terms = data.terms;
				
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;

				let address = data.address;
				let cityName = data.cityName;
				let stateCode = data.stateCode;
				let countryCode = data.countryCode;
				let postalCode = data.postalCode;

				let NPWPNumber = data.NPWPNumber;
				let NPWPName = data.NPWPName;
				let NPWPAddress = data.NPWPAddress;

				if (!name || !code || !businessTypeID) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama, Kode, dan Tipe Bisnis Wajib Diisi';
					return returnData;
				}

				let countExist = VendorsCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Supplier Sudah ada di Sistem';
					return returnData;
				}

				if (businessTypeID) {
					let isExist = BusinessTypesCollections.find({
						code: businessTypeID,
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
						name: countryCode,
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
						name: stateCode,
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
					relasi,
					terms,
					phoneNumber,
					mobileNumber,
					address,
					cityName,
					stateCode,
					countryCode,
					postalCode,
					NPWPNumber,
					NPWPName,
					NPWPAddress,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};

				VendorsCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'SUPPLIER',
					title: 'Add Supplier',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Supplier Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.supplier.add',
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
		'vendors.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				let name = data.name;
				let code = data.code;

				let businessTypeID = data.businessTypeID;
				let relasi = data.relasi;
				let terms = data.terms;
				
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;

				let address = data.address;
				let cityName = data.cityName;
				let stateCode = data.stateCode;
				let countryCode = data.countryCode;
				let postalCode = data.postalCode;

				let NPWPNumber = data.NPWPNumber;
				let NPWPName = data.NPWPName;
				let NPWPAddress = data.NPWPAddress;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Supplier tidak ditemukan';
					return returnData;
				}
				if (!name || !code || !businessTypeID) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Nama, Kode, Kontak Utama, Tipe Bisnis Wajib Diisi';
					return returnData;
				}

				let currData = VendorsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Supplier tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = VendorsCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Supplier Sudah ada di Sistem';
						return returnData;
					}
				}

				if (businessTypeID) {
					let isExist = BusinessTypesCollections.find({
						code: businessTypeID,
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
						name: countryCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Negara tidak ditemukan';
						return returnData;
					}
				}

				if (stateCode) {
					let isExist = StatesCollections.find({
						name: stateCode,
					}).count();

					if (isExist === 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Data Provinsi tidak ditemukan';
						return returnData;
					}
				}

				if (cityName ) {
					let isExist = CitiesCollections.find({
						name: cityName,
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
					relasi,
					terms,
					phoneNumber,
					mobileNumber,
					address,
					cityName,
					stateCode,
					countryCode,
					postalCode,
					NPWPNumber,
					NPWPName,
					NPWPAddress,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				VendorsCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'SUPPLIER',
					title: 'Edit Supplier',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Supplier Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.supplier.add',
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
		'vendors.delete'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {

				let _id = data._id;

				let currData = VendorsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Supplier tidak ditemukan';
					return returnData;
				}

				VendorsCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'SUPPLIER',
					title: 'Delete Supplier',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Supplier Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.supplier.add',
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
