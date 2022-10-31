import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CashierOnGoingTransactionsCollections = new Mongo.Collection(
	'tra_cashier_ongoings'
);

export const cashierOnGoingTransactionsSchema = new SimpleSchema({
	warehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	productID: { type: String, regEx: SimpleSchema.RegEx.Id },
	productName: { type: String },
	productCode: { type: String },
	productImage: { type: String },
	productPrice: { type: Number, defaultValue: 0 },
	productQuantity: { type: Number, defaultValue: 0 },
	productDiscount: { type: Number, defaultValue: 0 },
	productSubTotal: { type: Number, defaultValue: 0 },
	productUOMID: { type: String },
	productUOMCode: { type: String },
	productUOMName: { type: String },
	productDescription: { type: String },
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
CashierOnGoingTransactionsCollections.schema = cashierOnGoingTransactionsSchema;

export const CashierOnGoingTransactionsConfigurationsCollections =
	new Mongo.Collection('tra_cashier_ongoings_configurations');

export const cashierOnGoingTransactionsConfigurationsSchema = new SimpleSchema({
	warehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
	name: { type: String },
	value: { type: String },
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
CashierOnGoingTransactionsConfigurationsCollections.schema =
	cashierOnGoingTransactionsConfigurationsSchema;
