import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { BrandsCollections } from '../../db/Brands';
import { addErrorLog, addLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.methods({
		'brands.add'(data) {
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
				let imageBase64 = data.imageBase64;
				// base64String = "data:image/jpeg;base64......";

				// var stringLength = base64String.length - 'data:image/png;base64,'.length;

				// var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
				// var sizeInKb=sizeInBytes/1000;
				if (imageBase64) {
					const type = imageBase64.split(';')[0].split('/')[1];
					if (type !== 'png' && type !== 'jpeg' && type !== 'jpg') {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Format gambar yang diijinkan hanya PNG, JPEG/JPG';
						return returnData;
					}
				}

				if (!name || !code) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama Brand';
					return returnData;
				}

				let countExist = BrandsCollections.find({
					code,
				}).count();

				if (countExist > 0) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Brand Sudah ada di Sistem';
					return returnData;
				}

				let insertData = {
					code,
					name,
					imageBase64,
					modifiedAt: new Date(),
					createdAt: new Date(),
					modifiedBy: Meteor.user().username,
					createdBy: Meteor.user().username,
				};

				BrandsCollections.insert(insertData);

				addLog(this, {
					type: 'ADD',
					module: 'BRANDS',
					title: 'Add Brand ',
					description: JSON.stringify(insertData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Brand Berhasil ditambah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.brands.add',
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
		'brands.edit'(data) {
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
				let imageBase64 = data.imageBase64;

				if (imageBase64) {
					const type = imageBase64.split(';')[0].split('/')[1];
					if (type !== 'png' && type !== 'jpeg' && type !== 'jpg') {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message =
							'Format gambar yang diijinkan hanya PNG, JPEG/JPG';
						return returnData;
					}
				}
				if (!_id) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Brand tidak ditemukan';
					return returnData;
				}
				if (!name || !code) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Silahkan isi Kode dan Nama Brand';
					return returnData;
				}

				let currData = BrandsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Brand tidak ditemukan';
					return returnData;
				}

				if (!imageBase64) {
					imageBase64 = currData.imageBase64;
				}

				if (currData.code !== code) {
					let countExist = BrandsCollections.find({
						code,
					}).count();

					if (countExist > 0) {
						returnData.code = 400;
						returnData.title = 'Kesalahan Validasi';
						returnData.message = 'Brand Sudah ada di Sistem';
						return returnData;
					}
				}

				let updateData = {
					code,
					name,
					imageBase64,
					modifiedAt: new Date(),
					modifiedBy: Meteor.user().username,
				};

				BrandsCollections.update({ _id }, { $set: updateData });

				addLog(this, {
					type: 'EDIT',
					module: 'BRANDS',
					title: 'Edit Brand ',
					description:
						JSON.stringify(currData) +
						' -> ' +
						JSON.stringify(updateData),
				});

				returnData.title = 'Berhasil';
				returnData.message = 'Data Brand Berhasil diubah';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.brands.add',
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
		'brands.delete'(data) {
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

				let currData = BrandsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Brand tidak ditemukan';
					return returnData;
				}

				BrandsCollections.remove({ _id });

				addLog(this, {
					type: 'DELETE',
					module: 'BRANDS',
					title: 'Delete Brand ',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Data Brand Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.brands.add',
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
		'brands.deleteImage'(data) {
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

				let currData = BrandsCollections.findOne({
					_id,
				});

				if (!currData) {
					returnData.code = 400;
					returnData.title = 'Kesalahan Validasi';
					returnData.message = 'Data Brand tidak ditemukan';
					return returnData;
				}

				BrandsCollections.update(
					{ _id },
					{
						$set: {
							imageBase64: '',
						},
					}
				);

				addLog(this, {
					type: 'DELETE',
					module: 'BRANDS_IMAGES',
					title: 'Delete Brand Image',
					description: JSON.stringify(currData),
				});
				returnData.title = 'Berhasil';
				returnData.message = 'Gambar Brand Berhasil dihapus';

				return returnData;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'BACKEND',
					'method.brands.add',
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
