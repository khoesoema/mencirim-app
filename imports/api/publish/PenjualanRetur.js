import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PenjualanReturCollections } from '../../db/PenjualanRetur';
import { addErrorLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('penjualanretur.countAll', function penjualanretur_countAll(data) {
		try {
			console.log('publish.penjualanretur.countAll');

			Counts.publish(
				this,
				'penjualanretur.countAll',
				PenjualanReturCollections.find({}),
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
				'publish.penjualanretur.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('penjualanretur.countList', function penjualanretur_countAll(data) {
		try {
			console.log('publish.penjualanretur.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'penjualanretur.countList.' + searchText,
				PenjualanReturCollections.find({
					noFaktur: {
                        $regex: searchText,
                        $options: 'i',
                    },
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
				'publish.penjualanretur.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('penjualanretur.list', function penjualanretur_countAll(data) {
		try {
			console.log('publish.penjualanretur.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = PenjualanReturCollections.find(
				{
					noFaktur: {
                        $regex: searchText,
                        $options: 'i',
                    },
				},
				{
					sort: sortObject,
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
				'publish.penjualanretur.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('penjualanretur.getByID', function penjualanretur_countAll(data) {
		try {
			console.log('publish.penjualanretur.getByID');

			let _id = data._id;

			let datasCursor = PenjualanReturCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.penjualanretur.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('penjualanretur.search', function penjualanretur_countAll(data) {
		try {
			console.log('publish.penjualanretur.search');

			let inProductIDs = data.inProductIDs;
			let selectedIDs = data.selectedIDs;
			let selectedID = data.selectedID;
			let searchText = data.searchText;

			if (searchText.length > 2) {
				let findOrObject = [
					{
						kodeBarang: {
							$regex: searchText,
							$options: 'i',
						},
					},
					{
						namaBarang: {
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
						_id: { $in: selectedIDs },
					});
				}

				if (inProductIDs) {
					let datasCursor = PenjualanReturCollections.find({
						_id: {
							$in: inProductIDs,
						},
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					let datasCursor = PenjualanReturCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				}
			} else {
				if (inProductIDs) {
					if (selectedID) {
						let datasCursor = PenjualanReturCollections.find({
							$or: [
								{
									_id: selectedID,
								},
								{
									_id: {
										$in: inProductIDs,
									},
								},
							],
						});

						return datasCursor;
					}
					if (selectedIDs) {
						let datasCursor = PenjualanReturCollections.find({
							$or: [
								{
									_id: { $in: selectedIDs },
								},
								{
									_id: {
										$in: inProductIDs,
									},
								},
							],
						});

						return datasCursor;
					}
				} else {
					if (selectedID) {
						let datasCursor = PenjualanReturCollections.find({
							_id: selectedID,
						});

						return datasCursor;
					}
					if (selectedIDs) {
						let datasCursor = PenjualanReturCollections.find({
							_id: { $in: selectedIDs },
						});

						return datasCursor;
					}
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
				'publish.penjualanretur.search',
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
