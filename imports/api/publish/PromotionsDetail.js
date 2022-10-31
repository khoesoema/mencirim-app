import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { PromotionsDetailCollections } from '../../db/PromotionsDetail';
import { addErrorLog } from '../methods/Logs';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('promotionsdetail.countAll', function promotionsdetail_countAll() {
		try {
			console.log('publish.promotionsdetail.countAll');

			Counts.publish(
				this,
				'promotionsdetail.countAll',
				PromotionsDetailCollections.find({}),
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
				'publish.promotionsdetail.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotionsdetail.countList', function promotionsdetail_countList(data) {
		try {
			console.log('publish.promotionsdetail.countList');

			let searchText = data.promoNo;
			Counts.publish(
				this,
				'promotionsdetail.countList.' + searchText,
				PromotionsDetailCollections.find({
					promoNo: searchText,
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
				'publish.promotionsdetail.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotionsdetail.list', function promotionsdetail_list(data) {
		try {
			console.log('publish.promotionsdetail.list');

			let searchText = data.promoNo;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = PromotionsDetailCollections.find(
				{
					promoNo: searchText,
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
				'publish.promotionsdetail.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotionsdetail.getByID', function promotionsdetail_getByID(data) {
		try {
			console.log('publish.promotionsdetail.getByID');

			let _id = data.selectedID;

			let datasCursor = PromotionsDetailCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.promotionsdetail.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('promotionsdetail.getByTgl', function promotionsdetail_getByTgl(data) {
		try {
			console.log('publish.promotionsdetail.getByTgl', data.kodeBarang,  moment(data.tglTrx).format('YYYYMMDD'));

			let tgl = moment(data.tglTrx).format('YYYYMMDD');
			let kodeBarang = data.kodeBarang;

			ReactiveAggregate(
				this,
				PromotionsDetailCollections,
				[{
					$project: {
						kodeBarang: 1,
						namaBarang: 1,
						target: 1,
						diskonPersen: 1,
						diskonHarga: 1,
						startDate: {
							$dateToString: {
								format: '%Y%m%d',
								date: '$startDate'
							}
						},
						endDate: {
							$dateToString: {
								format: '%Y%m%d',
								date: '$endDate'
							}
						}
					}
				}, {
					$match: {
						'kodeBarang': kodeBarang,
						'startDate': {
							$lte: tgl
						},
						'endDate': {
							$gte: tgl
						}
					}
				}, {
					$sort: {
						startDate: -1
					}
				}, {
					$limit: 1
				}]
			)
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.promotionsdetail.getByTgl',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});


	Meteor.publish('promotionsdetail.search', function promotionsdetail_search(data) {
		try {
			console.log('publish.promotionsdetail.search');

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
					let datasCursor = PromotionsDetailCollections.find({
						_id: {
							$in: inProductIDs,
						},
						$or: findOrObject,
					});

					return datasCursor;
				} else {
					let datasCursor = PromotionsDetailCollections.find({
						$or: findOrObject,
					});

					return datasCursor;
				}
			} else {
				if (inProductIDs) {
					if (selectedID) {
						let datasCursor = PromotionsDetailCollections.find({
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
						let datasCursor = PromotionsDetailCollections.find({
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
						let datasCursor = PromotionsDetailCollections.find({
							_id: selectedID,
						});

						return datasCursor;
					}
					if (selectedIDs) {
						let datasCursor = PromotionsDetailCollections.find({
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
				'publish.promotionsdetail.search',
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
