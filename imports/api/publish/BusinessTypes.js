import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
// import { UsersCollections } from '../../db/Users';
import { BusinessTypesCollections } from '../../db/BusinessTypes';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish(
		'businessTypes.countAll',
		function businessTypes_countAll(data) {
			try {
				console.log('publish.businessTypes.countAll');

				Counts.publish(
					this,
					'businessTypes.countAll',
					BusinessTypesCollections.find({}),
					{ noReady: true }
				);
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.businessTypes.countAll',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);

	Meteor.publish(
		'businessTypes.countList',
		function businessTypes_countAll(data) {
			try {
				console.log('publish.businessTypes.countList');

				let searchText = data.searchText;
				Counts.publish(
					this,
					'businessTypes.countList.' + searchText,
					BusinessTypesCollections.find({
						$or: [
							{
								code: {
									$regex: searchText,
									$options: 'i',
								},
							},
							{
								name: {
									$regex: searchText,
									$options: 'i',
								},
							},
						],
					}),
					{ noReady: true }
				);
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.businessTypes.countList',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);

	Meteor.publish('businessTypes.list', function businessTypes_countAll(data) {
		try {
			console.log('publish.businessTypes.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = BusinessTypesCollections.find(
				{
					$or: [
						{
							code: {
								$regex: searchText,
								$options: 'i',
							},
						},
						{
							name: {
								$regex: searchText,
								$options: 'i',
							},
						},
					],
				},
				{
					sort: sortObject,
					skip: offset,
					limit,
				}
			);

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.businessTypes.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish(
		'businessTypes.getByID',
		function businessTypes_countAll(data) {
			try {
				console.log('publish.businessTypes.getByID');

				let _id = data._id;

				let datasCursor = BusinessTypesCollections.find({ _id });

				return datasCursor;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.businessTypes.getByID',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);

	Meteor.publish(
		'businessType.getByCode',
		function businessTypes_countAll(data) {
			try {
				console.log('publish.businessType.getByCode');

				let code = data.code;

				let datasCursor = BusinessTypesCollections.find({ code });

				return datasCursor;
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.businessType.getByCode',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);

	Meteor.publish(
		'businessTypes.search',
		function businessTypes_countAll(data) {
			try {
				console.log('publish.businessTypes.search');

				let selectedID = data.selectedID;
				let searchText = data.searchText;

				if (searchText.length > 1) {
					let findOrObject = [
						{
							code: {
								$regex: searchText,
								$options: 'i',
							},
						},
						{
							name: {
								$regex: searchText,
								$options: 'i',
							},
						},
					];

					if (selectedID) {
						findOrObject.push({
							code: selectedID,
						});
					}

					let datasCursor = BusinessTypesCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					if (selectedID) {
						let datasCursor = BusinessTypesCollections.find({
							code: selectedID,
						});

						return datasCursor;
					}
				}
			} catch (tryErr) {
				console.log(tryErr);
				let currLine = getCurrentLine();
				let errorCode = addErrorLog(
					currLine.line,
					currLine.file,
					this,
					'AGENT',
					'publish.businessTypes.search',
					tryErr.message
				);
				throw new Meteor.Error(
					'Terjadi Kesalahan',
					'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
						errorCode
				);
			}
		}
	);
}
