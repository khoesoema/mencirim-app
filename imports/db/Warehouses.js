import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const WarehousesCollections = new Mongo.Collection('mst_warehouses');

export const warehousesSchema = new SimpleSchema({
	isStore: { type: Number, defaultValue: 0 },
	name: { type: String },
	code: { type: String },
	locationID: { type: String, regEx: SimpleSchema.RegEx.Id },
	modifiedBy: { type: String },
	createdBy: { type: String },
	modifiedAt: {
		type: Date,
		defaultValue: Date.now,
	},
	createdAt: {
		type: Date,
		defaultValue: Date.now,
	},
});
WarehousesCollections.schema = warehousesSchema;

export const WarehousesCompaniesCollections = new Mongo.Collection(
	'mst_warehouses_companies'
);

export const warehousesCompaniesSchema = new SimpleSchema({
	warehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	companyID: { type: String, regEx: SimpleSchema.RegEx.Id },
	createdBy: { type: String },
	createdAt: {
		type: Date,
		defaultValue: Date.now,
	},
});
WarehousesCompaniesCollections.schema = warehousesCompaniesSchema;
