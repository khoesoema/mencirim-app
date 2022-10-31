import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PembelianCollections } from '../../db/Pembelian';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('pembelian.countAll', function pembelian_countAll(data) {
		try {
			console.log('publish.pembelian.countAll');

			Counts.publish(
				this,
				'pembelian.countAll',
				PembelianCollections.find({}),
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
				'publish.pembelian.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('pembelian.countList', function pembelian_countAll(data) {
		try {
			console.log('publish.pembelian.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'pembelian.countList.' + searchText,
				PembelianCollections.find({
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
				'publish.pembelian.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('pembelian.list', function pembelian_countAll(data) {
		try {
			console.log('publish.pembelian.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = PembelianCollections.find(
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
				'publish.pembelian.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('pembelian.getByID', function pembelian_countAll(data) {
		try {
			console.log('publish.pembelian.getByID');

			let _id = data._id;

			let datasCursor = PembelianCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.pembelian.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('pembelian.search', function pembelian_countAll(data) {
		try {
			console.log('publish.pembelian.search');

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
					let datasCursor = PembelianCollections.find({
						_id: {
							$in: inProductIDs,
						},
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					let datasCursor = PembelianCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				}
			} else {
				if (inProductIDs) {
					if (selectedID) {
						let datasCursor = PembelianCollections.find({
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
						let datasCursor = PembelianCollections.find({
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
						let datasCursor = PembelianCollections.find({
							_id: selectedID,
						});

						return datasCursor;
					}
					if (selectedIDs) {
						let datasCursor = PembelianCollections.find({
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
				'publish.pembelian.search',
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
