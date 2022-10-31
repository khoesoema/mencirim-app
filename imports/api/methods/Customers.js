import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import { Random } from 'meteor/random';
import 'moment/locale/id';

import { CustomersCollections } from '../../db/Customers';
import { addErrorLog, addLog } from '../methods/Logs';
import { SystemConfigCollections } from '../../db/Systems';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'customers.add'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				
				let code = data.code;
				let name = data.name;
				let birthDate = data.birthDate;
				let birthPlace = data.birthPlace;
				let gender = data.gender;
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;
				let address = data.address;
				let kelurahan = data.kelurahan;
				let kecamatan = data.kecamatan;
				let cityName = data.cityName;
				let stateCode = data.stateCode;
				let countryCode = data.countryCode;
				let postalCode = data.postalCode;
				let NPWPNumber = data.NPWPNumber;
				let identityNumber = data.identityNumber;
				let validDate = data.validDate;
				let current = data.current;

				let countExist = CustomersCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message =
						'Data Customer Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					code,
					name,
					birthDate,
					birthPlace,
					gender,
					phoneNumber,
					mobileNumber,
					address,
					kelurahan,
					kecamatan,
					cityName,
					stateCode,
					countryCode,
					postalCode,
					identityNumber,
					NPWPNumber,
					validDate,
					current,
					createdBy: Meteor.user().username,
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					modifiedAt: new Date(),
				};

				CustomersCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'CUSTOMERS',
					title: 'Add Customer',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Customer Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.customers.add',
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
		'customers.edit'(data) {
			let returnData = {
				code: 200,
				title: '',
				message: '',
			};

			try {
				let _id = data._id;
				
				let code = data.code;
				let name = data.name;
				let birthDate = data.birthDate;
				let birthPlace = data.birthPlace;
				let gender = data.gender;
				let phoneNumber = data.phoneNumber;
				let mobileNumber = data.mobileNumber;
				let address = data.address;
				let kelurahan = data.kelurahan;
				let kecamatan = data.kecamatan;
				let cityName = data.cityName;
				let stateCode = data.stateCode;
				let countryCode = data.countryCode;
				let postalCode = data.postalCode;
				let NPWPNumber = data.NPWPNumber;
				let identityNumber = data.identityNumber;
				let validDate = data.validDate;
				let current = data.current;

				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Customer tidak ditemukan';
					return returnData;
				}

				let currData = CustomersCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Customer tidak ditemukan';
					return returnData;
				}

				if (currData.code !== code) {
					let countExist = CustomersCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Customer Sudah ada di Sistem';
						return returnData;
					}
				}

				let updateData = {
					code,
					name,
					birthDate,
					birthPlace,
					gender,
					phoneNumber,
					mobileNumber,
					address,
					kelurahan,
					kecamatan,
					cityName,
					stateCode,
					countryCode,
					postalCode,
					identityNumber,
					NPWPNumber,
					validDate,
					current,
					modifiedBy: Meteor.user().username,
					modifiedAt: new Date(),
				};

				CustomersCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'CUSTOMERS',
					title: 'Edit Customer',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Customer Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.customers.add',
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
		'customers.delete'(data) {
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

				let currData = CustomersCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Customer tidak ditemukan';
					return returnData;
				}

				CustomersCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'CUSTOMERS',
					title: 'Delete Customer',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Customer Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.customers.add',
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
