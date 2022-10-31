import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const StocksTransactionsCollections = new Mongo.Collection('tra_stocks');

export const stocksTransactionsSchema = new SimpleSchema({
	invoiceID: { type: String, regEx: SimpleSchema.RegEx.Id },
	invoiceNumber: { type: String },
	status: { type: Number, defaultValue: 0 },
	type: { type: Number, defaultValue: 0 },
	transactionDate: {
		type: Date,
		defaultValue: Date.now,
	},
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
StocksTransactionsCollections.schema = stocksTransactionsSchema;

export const StocksLedgersCollections = new Mongo.Collection(
	'tra_stocks_ledgers'
);

export const stocksLedgersSchema = new SimpleSchema({
	invoiceNumber: { type: String },
	invoiceID: { type: String, regEx: SimpleSchema.RegEx.Id },
	productID: { type: String, regEx: SimpleSchema.RegEx.Id },
	warehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	rackID: { type: String, regEx: SimpleSchema.RegEx.Id },
	uomID: { type: String, regEx: SimpleSchema.RegEx.Id },
	quantity: { type: Number, defaultValue: 0 },
	status: { type: Number, defaultValue: 0 },
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
StocksLedgersCollections.schema = stocksLedgersSchema;

export const StocksTransfersCollections = new Mongo.Collection(
	'tra_stocks_transfers'
);

export const stocksTransfersSchema = new SimpleSchema({
	transferNumber: { type: String },
	description: { type: String },
	status: { type: Number, defaultValue: 0 },
	transactionDate: {
		type: Date,
		defaultValue: Date.now,
	},
	sourceWarehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	destinationWarehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	sourceRackID: { type: String, regEx: SimpleSchema.RegEx.Id },
	destinationRackID: { type: String, regEx: SimpleSchema.RegEx.Id },
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
StocksTransfersCollections.schema = stocksTransfersSchema;

export const StocksTransfersItemsCollections = new Mongo.Collection(
	'tra_stocks_transfers_items'
);

export const stocksTransfersItemsSchema = new SimpleSchema({
	transferNumber: { type: String },
	productID: { type: String, regEx: SimpleSchema.RegEx.Id },
	uomID: { type: String, regEx: SimpleSchema.RegEx.Id },
	warehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	rackID: { type: String, regEx: SimpleSchema.RegEx.Id },
	quantity: { type: Number, defaultValue: 0 },
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
StocksTransfersItemsCollections.schema = stocksTransfersItemsSchema;

export const StocksConversionsCollections = new Mongo.Collection(
	'tra_stocks_conversions'
);

export const stocksConversionsSchema = new SimpleSchema({
	conversionNumber: { type: String },
	description: { type: String },
	warehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	rackID: { type: String, regEx: SimpleSchema.RegEx.Id },
	status: { type: Number, defaultValue: 0 },
	transactionDate: {
		type: Date,
		defaultValue: Date.now,
	},
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
StocksConversionsCollections.schema = stocksConversionsSchema;

export const StocksConversionsItemsCollections = new Mongo.Collection(
	'tra_stocks_conversions_items'
);

export const stocksConversionsItemsSchema = new SimpleSchema({
	conversionNumber: { type: String },
	productID: { type: String, regEx: SimpleSchema.RegEx.Id },
	sourceUOMID: { type: String, regEx: SimpleSchema.RegEx.Id },
	destinationUOMID: { type: String, regEx: SimpleSchema.RegEx.Id },
	sourceQuantity: { type: Number, defaultValue: 0 },
	destinationQuantity: { type: Number, defaultValue: 0 },
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
StocksConversionsItemsCollections.schema = stocksConversionsItemsSchema;
