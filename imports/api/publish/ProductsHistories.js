import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

//import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';

import { ProductsHistoriesCollections } from '../../db/Products';
import { addErrorLog } from '../methods/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('productshistories.countAll', function productshistories_countAll(data) {
		try {
			console.log('publish.productshistories.countAll');

			Counts.publish(
				this,
				'productshistories.countAll',
				ProductsHistoriesCollections.find({}),
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
				'publish.productshistories.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('productshistories.countList', function productshistories_countList(data) {
		try {
			console.log('publish.productshistories.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'productshistories.countList.' + searchText,
				ProductsHistoriesCollections.find({
					kodeBarang:  searchText,
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
				'publish.productshistories.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('productshistories.sumHarga', function productshistories_sumHarga(data) {
		try {
			

			let tgl = new Date(data.bulan);
			let bulan = (tgl.getMonth() + 1);
			let tahun = tgl.getUTCFullYear();

			console.log('publish.productshistories.sumHarga', bulan, tahun);

			ReactiveAggregate(
				this,
				ProductsHistoriesCollections,
				[
					{
						$project: {
							jenis: 1, 
							hargaNetto: 1,
							profitJual: 1,
							month: {$month: '$tglFaktur'}, 
							year: {$year: '$tglFaktur'}
						}
					},
					{
						$match: { year: tahun, month: bulan }
					},
					{ 
						$group : { 
							_id: "$jenis", 
							count: {$sum:1},
							total: {$sum: "$hargaNetto"}, 
							profit: {$sum: "$profitJual"}
						}
					}
				]
			);

		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.productshistories.sumHarga',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('productshistories.sumHargaYear', function productshistories_sumHargaYear(data) {
		try {
			

			let tgl = new Date(data.tahun);
			let tahun = tgl.getUTCFullYear();

			console.log('publish.productshistories.sumHargaYear', tahun);

			ReactiveAggregate(
				this,
				ProductsHistoriesCollections,
				[
					{
						$project: {
							jenis: 1, 
							hargaNetto: 1,
							profitJual: 1,
							month: {$month: '$tglFaktur'}, 
							year: {$year: '$tglFaktur'}
						}
					},
					{
						$match: { year: tahun }
					},
					{
						$group: {
							_id: { jenis: "$jenis", month: "$month" }, 
							count: {$sum:1},
							total: {$sum: "$hargaNetto"}, 
							profit: {$sum: "$profitJual"}
						}
					},
					{
						$project: {
							_id: { 
								$concat: [
									"$_id.jenis", 
									"-",
									{ $toString: "$_id.month" }
							]},
							jenis: "$_id.jenis",
							month: "$_id.month",
							count: "$count",
							total: "$total", 
							profit: "$profit"
						}
					}
				]
			);

		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.productshistories.sumHargaYear',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});


	Meteor.publish('productshistories.countBrg', function productshistories_countBrg() {
		try {
			
			let bulan = (new Date().getMonth() + 1);
			let tahun = new Date().getUTCFullYear();

			console.log('publish.productshistories.countBrg', bulan, tahun);

			ReactiveAggregate(
				this,
				ProductsHistoriesCollections,
				[
					{
						$project: {
							kodeBarang: 1,
							namaBarang: 1,
							jenis: 1, 
							ktsKecil: 1,
							month: {$month: '$tglFaktur'}, 
							year: {$year: '$tglFaktur'}
						}
					},
					{
						$match: { 
							jenis: { $in: ['Penjualan','Retur Penjualan']}, 
							year: tahun, 
							month: bulan 
						}
					},
					{ 
						$group: {
							_id: "$kodeBarang",
							nama: { $first: "$namaBarang"} , 
							jumlah: {$sum: { $multiply:["$ktsKecil",-1]} }
						}
					}
				]
			);

		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.productshistories.countBrg',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('productshistories.list', function productshistories_list(data) {
		try {
			console.log('publish.productshistories.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = ProductsHistoriesCollections.find(
				{
					kodeBarang:  searchText,
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
				'publish.productshistories.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('productshistories.getByID', function productshistories_getByID(data) {
		try {
			console.log('publish.productshistories.getByID');

			let _id = data._id;

			let datasCursor = ProductsHistoriesCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.productshistories.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('productshistories.getByKode', function productshistories_getByKode(data) {
		try {
			console.log('publish.productshistories.getByKode');

			let kodeBarang = data.kodeBarang;

			let datasCursor = ProductsHistoriesCollections.find({ kodeBarang });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorCode = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.productshistories.getByKode',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorCode
			);
		}
	});

	Meteor.publish('productshistories.search', function productshistories_search(data) {
		try {
			console.log('publish.productshistories.search');

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

				let datasCursor = ProductsHistoriesCollections.find(
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
					let datasCursor = ProductsHistoriesCollections.find({
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
				'publish.productshistories.search',
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
