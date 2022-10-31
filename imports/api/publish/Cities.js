import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CitiesCollections } from '../../db/Cities';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('cities.countList', function cities_countList(data) {
		try {
			console.log('publish.cities.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'cities.countList.' + searchText,
				CitiesCollections.find({
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
				'publish.cities.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('cities.list', function cities_list(data) {
		try {
			console.log('publish.cities.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = CitiesCollections.find(
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
				'publish.cities.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('cities.getByID', function cities_getByID(data) {
		try {
			console.log('publish.cities.getByID');

			let _id = data._id;

			let datasCursor = CitiesCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.cities.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('cities.search', function cities_search(data) {
		try {
			console.log('publish.cities.search');

			let selectedID = data.selectedID;
			let searchText = data.searchText;

			if (searchText.length > 2) {
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

				let datasCursor = CitiesCollections.find({
					$or: findOrObject,
				});

				return datasCursor;
			} else {
				if (selectedID) {
					let datasCursor = CitiesCollections.find({
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
				'publish.cities.search',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});
}
