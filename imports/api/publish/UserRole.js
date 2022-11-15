import getCurrentLine from 'get-current-line';
import moment from 'moment-timezone';
import 'moment/locale/id';

import { UserRoleCollections } from '../../db/UserRole';
import { addErrorLog } from '../methods/Logs';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

if (Meteor.isServer) {
	Meteor.publish('userrole.countAll', function userrole_countAll(data) {
		try {
			console.log('publish.userrole.countAll');

			Counts.publish(
				this,
				'userrole.countAll',
				UserRoleCollections.find({}),
				{ noReady: true }
			);
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorroleid = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.userrole.countAll',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorroleid
			);
		}
	});

	Meteor.publish('userrole.countList', function userrole_countAll(data) {
		try {
			console.log('publish.userrole.countList');

			let searchText = data.searchText;
			Counts.publish(
				this,
				'userrole.countList.' + searchText,
				UserRoleCollections.find({
					$or: [
						{
							roleid: {
								$regex: searchText,
								$options: 'i',
							},
						},
						{
							roledesc: {
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
			let errorroleid = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.userrole.countList',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorroleid
			);
		}
	});

	Meteor.publish('userrole.list', function userrole_countAll(data) {
		try {
			console.log('publish.userrole.list');

			let searchText = data.searchText;
			let page = data.page;
			let orderByColumn = data.orderByColumn;
			let order = data.order;

			let limit = 20;
			let offset = (page - 1) * limit;

			let sortObject = {};

			sortObject[orderByColumn] = order;

			let datasCursor = UserRoleCollections.find(
				{
					$or: [
						{
							roleid: {
								$regex: searchText,
								$options: 'i',
							},
						},
						{
							roledesc: {
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
			let errorroleid = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.userrole.list',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorroleid
			);
		}
	});

	Meteor.publish('userrole.getByID', function userrole_countAll(data) {
		try {
			console.log('publish.userrole.getByID');

			let _id = data._id;

			let datasCursor = UserRoleCollections.find({ _id });

			return datasCursor;
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorroleid = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.userrole.getByID',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorroleid
			);
		}
	});

	Meteor.publish('userrole.search', function userrole_countAll(data) {
		try {
			console.log('publish.userrole.search');

			let selectedID = data.selectedID;
			let searchText = data.searchText;

			if (searchText.length > 2) {
				let findOrObject = [
					{
						roleid: {
							$regex: searchText,
							$options: 'i',
						},
					},
					{
						roledesc: {
							$regex: searchText,
							$options: 'i',
						},
					},
				];

				if (selectedID) {
					findOrObject.push({
						roleid: selectedID,
					});
				}

				let datasCursor = UserRoleCollections.find({
					$or: findOrObject,
				});

				return datasCursor;
			} else {
				if (selectedID) {
					let datasCursor = UserRoleCollections.find({
						roleid: selectedID,
					});

					return datasCursor;
				}
			}
		} catch (tryErr) {
			console.log(tryErr);
			let currLine = getCurrentLine();
			let errorroleid = addErrorLog(
				currLine.line,
				currLine.file,
				this,
				'AGENT',
				'publish.userrole.search',
				tryErr.message
			);
			throw new Meteor.Error(
				'Terjadi Kesalahan',
				'Terjadi Kesalahan, silahkan hubungi customer service. Kode Kesalahan = ' +
					errorroleid
			);
		}
	});
}
