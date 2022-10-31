import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { DataUsersCollections } from '../../db/Userscol';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('dataUser.countAll', function Users_countAll(data) {
		try {
			console.log('publish.dataUser.countAll');
		
			Counts.publish(this, 'dataUser.countAll', DataUsersCollections.find({}), {
				noReady: true,
			});
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorusername = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.dataUser.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorusername
			);
		}
	});

	Meteor.publish('dataUser.countList', function Users_countAll(data) {
		try {
			console.log('publish.dataUser.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'dataUser.countList.' + searchText,
				DataUsersCollections.find({
					$or: [
						{
							username: {
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
			let errorusername = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.dataUser.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorusername
			);
		}
	});

	Meteor.publish('dataUser.list', function Users_countAll(data) {
		try {
			console.log('publish.dataUser.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = DataUsersCollections.find(
				{
					$or: [
						{
							username: {
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
			let errorusername = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.dataUser.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorusername
			);
		}
	});

	Meteor.publish('dataUser.getByID', function Users_countAll(data) {
		try {
			console.log('publish.dataUser.getByID');

			let _id = data._id;

			let datasCursor = DataUsersCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorusername = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.dataUser.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorusername
			);
		}
	});

	Meteor.publish('dataUser.search', function Users_countAll(data) {
		try {
			console.log('publish.dataUser.search');

		
			let selectedIDs = data.selectedIDs;
			let selectedID = data.selectedID;
			let searchText = data.searchText;

			if (searchText.length > 2) {
				let findOrObject = [
					{
						username: {
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
						_id: selectedID,
					});
				}

				if (selectedIDs) {
					findOrObject.push({
						_id: {
							$in: selectedIDs,
						},
					});
				}

				let datasCursor = DataUsersCollections.find({
					$or: findOrObject,
				});

				return datasCursor;
			} else {
				if (selectedID) {
					let datasCursor = DataUsersCollections.find({
						_id: selectedID,
					});

					return datasCursor;
				}

				if (selectedIDs) {
					let datasCursor = DataUsersCollections.find({
						_id: {
							$in: selectedIDs,
						},
					});

					return datasCursor;
				}
			}
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorusername = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.dataUser.search',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorusername
			);
		}
	});
}
