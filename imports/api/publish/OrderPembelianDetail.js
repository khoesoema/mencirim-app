import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { OrderPembelianDetailCollections } from '../../db/OrderPembelianDetail';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('orderpembeliandetail.countAll', function orderpembeliandetail_countAll(data) {
		try {
			console.log('publish.orderpembeliandetail.countAll');

			Counts.publish(
				this,
				'orderpembeliandetail.countAll',
				OrderPembelianDetailCollections.find({}),
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
				'publish.orderpembeliandetail.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('orderpembeliandetail.countList', function orderpembeliandetail_countAll(data) {
		try {
			console.log('publish.orderpembeliandetail.countList');

			let searchText = data.noFaktur;
			Counts.publish(
				this,
				'orderpembeliandetail.countList.' + searchText,
				OrderPembelianDetailCollections.find({
					noFaktur: searchText,
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
				'publish.orderpembeliandetail.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('orderpembeliandetail.list', function orderpembeliandetail_countAll(data) {
		try {
			console.log('publish.orderpembeliandetail.list');

			let searchText = data.noFaktur;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = OrderPembelianDetailCollections.find(
				{
					noFaktur: searchText,
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
				'publish.orderpembeliandetail.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('orderpembeliandetail.getByID', function orderpembeliandetail_countAll(data) {
		try {
			console.log('publish.orderpembeliandetail.getByID');

			let _id = data.selectedID;

			let datasCursor = OrderPembelianDetailCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.orderpembeliandetail.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('orderpembeliandetail.search', function orderpembeliandetail_countAll(data) {
		try {
			console.log('publish.orderpembeliandetail.search');

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
					let datasCursor = OrderPembelianDetailCollections.find({
						_id: {
							$in: inProductIDs,
						},
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					let datasCursor = OrderPembelianDetailCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				}
			} else {
				if (inProductIDs) {
					if (selectedID) {
						let datasCursor = OrderPembelianDetailCollections.find({
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
						let datasCursor = OrderPembelianDetailCollections.find({
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
						let datasCursor = OrderPembelianDetailCollections.find({
							_id: selectedID,
						});

						return datasCursor;
					}
					if (selectedIDs) {
						let datasCursor = OrderPembelianDetailCollections.find({
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
				'publish.orderpembeliandetail.search',
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
