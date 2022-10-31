import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PromotionsCollections } from '../../db/Promotions';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('promotions.countAll', function promotions_countAll(data) {
		try {
			console.log('publish.promotions.countAll');

			Counts.publish(
				this,
				'promotions.countAll',
				PromotionsCollections.find({}),
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
				'publish.promotions.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotions.countList', function promotions_countList(data) {
		try {
			console.log('publish.promotions.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'promotions.countList.' + searchText,
				PromotionsCollections.find({
					promoNo: {
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
				'publish.promotions.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotions.list', function promotions_list(data) {
		try {
			console.log('publish.promotions.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = PromotionsCollections.find(
				{
					promoNo: {
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
				'publish.promotions.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotions.getByID', function promotions_getByID(data) {
		try {
			console.log('publish.promotions.getByID');

			let _id = data._id;

			let datasCursor = PromotionsCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.promotions.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotions.getByTanggal', function promotions_getByTanggal(data) {
		try {
			console.log('publish.promotions.getByTanggal');

			let tglTrx = data.tglTrx;

			let datasCursor = PromotionsCollections.find({ startDate: tglTrx });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.promotions.getByTanggal',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotions.search', function promotions_search(data) {
		try {
			console.log('publish.promotions.search');

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
					let datasCursor = PromotionsCollections.find({
						_id: {
							$in: inProductIDs,
						},
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					let datasCursor = PromotionsCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				}
			} else {
				if (inProductIDs) {
					if (selectedID) {
						let datasCursor = PromotionsCollections.find({
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
						let datasCursor = PromotionsCollections.find({
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
						let datasCursor = PromotionsCollections.find({
							_id: selectedID,
						});

						return datasCursor;
					}
					if (selectedIDs) {
						let datasCursor = PromotionsCollections.find({
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
				'publish.promotions.search',
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
