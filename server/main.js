import { Random } from 'meteor/random';

import '../imports/api/methods/Accounts';
import '../imports/api/methods/Brands';
import '../imports/api/methods/BusinessTypes';
import '../imports/api/methods/Cashier';
import '../imports/api/methods/Categories';
import '../imports/api/methods/Cities';
import '../imports/api/methods/Companies';
import '../imports/api/methods/Countries';
import '../imports/api/methods/Currencies';
import '../imports/api/methods/Customers';
import '../imports/api/methods/Kassa';
import '../imports/api/methods/Locations';
import '../imports/api/methods/Logs';
import '../imports/api/methods/PaymentTerms';
import '../imports/api/methods/Products';
import '../imports/api/methods/Pembelian';
import '../imports/api/methods/PembelianDetail';
import '../imports/api/methods/OrderPembelian';
import '../imports/api/methods/OrderPembelianDetail';
import '../imports/api/methods/ReturPembelian';
import '../imports/api/methods/ReturPembelianDetail';
import '../imports/api/methods/Penjualan';
import '../imports/api/methods/PenjualanDetail';
import '../imports/api/methods/PenjualanRetur';
import '../imports/api/methods/PenjualanReturDetail';
import '../imports/api/methods/Promotions';
import '../imports/api/methods/PromotionsDetail';
import '../imports/api/methods/Racks';
import '../imports/api/methods/States';
import '../imports/api/methods/Stocks';
import '../imports/api/methods/TaxCodes';
import '../imports/api/methods/UOM';
import '../imports/api/methods/Users';
import '../imports/api/methods/Userscol';
import '../imports/api/methods/UserRole';
import '../imports/api/methods/Vendors';
import '../imports/api/methods/Warehouses';

import '../imports/api/publish/Accounts';
import '../imports/api/publish/Brands';
import '../imports/api/publish/BusinessTypes';
import '../imports/api/publish/Cashier';
import '../imports/api/publish/Categories';
import '../imports/api/publish/Cities';
import '../imports/api/publish/Companies';
import '../imports/api/publish/Countries';
import '../imports/api/publish/Currencies';
import '../imports/api/publish/Customers';
import '../imports/api/publish/Kassa';
import '../imports/api/publish/Locations';
import '../imports/api/publish/Logs';
import '../imports/api/publish/ErrorLogs';
import '../imports/api/publish/PaymentTerms';
import '../imports/api/publish/Pembelian';
import '../imports/api/publish/PembelianDetail';
import '../imports/api/publish/OrderPembelian';
import '../imports/api/publish/OrderPembelianDetail';
import '../imports/api/publish/ReturPembelian';
import '../imports/api/publish/ReturPembelianDetail';
import '../imports/api/publish/Penjualan';
import '../imports/api/publish/PenjualanDetail';
import '../imports/api/publish/PenjualanRetur';
import '../imports/api/publish/PenjualanReturDetail';
import '../imports/api/publish/Products';
import '../imports/api/publish/ProductsHistories';
import '../imports/api/publish/Profit';
import '../imports/api/publish/Promotions';
import '../imports/api/publish/PromotionsDetail';
import '../imports/api/publish/Racks';
import '../imports/api/publish/States';
import '../imports/api/publish/Stocks';
import '../imports/api/publish/TaxCodes';
import '../imports/api/publish/UOM';
import '../imports/api/publish/Users';
import '../imports/api/publish/Userscol';
import '../imports/api/publish/UserRole';
import '../imports/api/publish/Vendors';
import '../imports/api/publish/Warehouses';

import { CitiesCollections } from '../imports/db/Cities';
import { CountriesCollections } from '../imports/db/Countries';
import { StatesCollections } from '../imports/db/States';

Meteor.startup(() => {
	if (!Accounts.findUserByUsername('sysadmin')) {
		Accounts.createUser({
			username: 'sysadmin',
			password: 'Qwop1290!@#',
		});
	}

	if (!Accounts.findUserByUsername('admin')) {
		Accounts.createUser({
			username: 'admin',
			password: '123456qwertyuiop!@#',
		});
	}

	if (!Accounts.findUserByUsername('admin1')) {
		Accounts.createUser({
			username: 'admin1',
			password: 'admin1',
		});
	}
});
if (Meteor.isServer) {
	readGeoLocations();
}

function readGeoLocations() {
	const fs = require('fs');
	//console.log(fs);
	if (
		fs.existsSync(
			process.cwd().split('.meteor')[0] +
				'server/countries+states+cities.json'
		)
	) {
		let rawdata = fs.readFileSync(
			process.cwd().split('.meteor')[0] +
				'server/countries+states+cities.json'
		);
		let geoLocations = JSON.parse(rawdata);

		let countriesBulk = Promise.await(
			CountriesCollections.rawCollection().initializeUnorderedBulkOp()
		);
		let statesBulk = Promise.await(
			StatesCollections.rawCollection().initializeUnorderedBulkOp()
		);
		let citiesBulk = Promise.await(
			CitiesCollections.rawCollection().initializeUnorderedBulkOp()
		);

		geoLocations.map((country) => {
			let countryName = country.name;
			let countryCode = country.iso3;

			countriesBulk
				.find({ code: countryCode, name: countryName })
				.upsert()
				.update({
					$set: {
						code: countryCode,
						name: countryName,
						lastUpdate: new Date(),
					},
					$setOnInsert: {
						_id: Random.id(),
					},
				});

			let states = country.states;

			states.map((state) => {
				let stateName = state.name;
				let stateCode = state.state_code;
				statesBulk
					.find({
						countryCode,
						countryName,
						name: stateName,
						code: stateCode,
					})
					.upsert()
					.update({
						$set: {
							countryCode,
							countryCode,
							code: stateCode,
							name: stateName,
							lastUpdate: new Date(),
						},
						$setOnInsert: {
							_id: Random.id(),
						},
					});
				let cities = state.cities;

				cities.map((city) => {
					let cityName = city.name;

					citiesBulk
						.find({
							countryCode,
							countryName,
							stateName,
							stateCode,
							name: cityName,
						})
						.upsert()
						.update({
							$set: {
								countryCode,
								countryName,
								stateName,
								stateCode,
								name: cityName,
								lastUpdate: new Date(),
							},
							$setOnInsert: {
								_id: Random.id(),
							},
						});
				});
			});
		});

		if (countriesBulk.length > 0) {
			Promise.await(countriesBulk.execute());
		}
		if (statesBulk.length > 0) {
			Promise.await(statesBulk.execute());
		}
		if (citiesBulk.length > 0) {
			Promise.await(citiesBulk.execute());
		}

		fs.renameSync(
			process.cwd().split('.meteor')[0] +
				'server/countries+states+cities.json',
			process.cwd().split('.meteor')[0] +
				'server/countries+states+cities_processed.json'
		);
	}
}
