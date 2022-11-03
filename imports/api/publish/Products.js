import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { ProductsCollections } from '../../db/Products';
import { addErrorLog } from '../methods/Logs';

import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('products.countAll', function products_countAll(data) {
		try {
			console.log('publish.products.countAll');

			Counts.publish(
				this,
				'products.countAll',
				ProductsCollections.find({}),
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
				'publish.products.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('products.countList', function products_countAll(data) {
		try {
			console.log('publish.products.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'products.countList.' + searchText,
				ProductsCollections.find({
					$or: [
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
				'publish.products.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('products.list', function products_countAll(data) {
		try {
			console.log('publish.products.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = ProductsCollections.find(
				{
					$or: [
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
				'publish.products.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('products.list2', function products_countAll(data) {
		try {
			console.log('publish.products.list2');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = ProductsCollections.find(
				{
					$or: [
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
					],
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
				'publish.products.list2',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('products.getByID', function products_countAll(data) {
		try {
			console.log('publish.products.getByID');

			let _id = data._id;

			let datasCursor = ProductsCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.products.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('products.countZero', function products_countZero() {
		try {

			let tahun = new Date().getUTCFullYear();

			console.log('publish.products.countZero', tahun);

			ReactiveAggregate(
				this,
				ProductsCollections,
				[{
					$project: {
					 	kodeBarang: 1,
					 	namaBarang: 1,
					 	qty: 1,
					 	tglLastTrx: 1,
					 	isoYear: {
					 	 	$dateToString: {
					 	 	 	format: '%G',
					 	 	 	date: '$tglLastTrx'
					 	 	}
					 	}
					}
				   	}, {
						$match: {
						 	qty: 0,
						 	isoYear: tahun.toString()
						}
				   	}, {
						$limit: 10
				   	}, {
						$sort: {
							tglLastTrx: 1
						}
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
				'publish.products.countZero',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('products.getByKode', function products_countAll(data) {
		try {
			console.log('publish.products.getByKode');

			let kodeBarang = data.kodeBarang;

			let datasCursor = ProductsCollections.find({ kodeBarang });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.products.getByKode',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('products.search', function products_search(data) {
		try {
			console.log('publish.products.search');

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
						kodeBarang: selectedID,
					});
				}

				let datasCursor = ProductsCollections.find(
					{
						$or: findOrObject,
					},
					{
						limit: 10,
					}
				);

				return datasCursor;
			} else {
				if (selectedID) {
					let datasCursor = ProductsCollections.find({
						kodeBarang: selectedID,
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
				'publish.products.search',
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
