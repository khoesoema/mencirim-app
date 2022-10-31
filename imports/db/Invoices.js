import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const InvoicesTransactionsCollections = new Mongo.Collection(
	'tra_invoices'
);

export const invoicesTransactionsSchema = new SimpleSchema({
	invoiceNumber: { type: String },
	status: { type: Number, defaultValue: 0 },
	type: { type: Number, defaultValue: 0 },
	vendorID: { type: String, regEx: SimpleSchema.RegEx.Id },
	customerID: { type: String, regEx: SimpleSchema.RegEx.Id },
	currencyID: { type: String, regEx: SimpleSchema.RegEx.Id },
	transactionDate: {
		type: Date,
		defaultValue: Date.now,
	},
	grandTotal: { type: Number, defaultValue: 0 },
	subTotal: { type: Number, defaultValue: 0 },
	discountTotal: { type: Number, defaultValue: 0 },
	paidTotal: { type: Number, defaultValue: 0 },
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
InvoicesTransactionsCollections.schema = invoicesTransactionsSchema;

export const InvoicesTransactionsItemsCollections = new Mongo.Collection(
	'tra_invoices_items'
);

export const invoicesTransactionsItemsSchema = new SimpleSchema({
	invoiceNumber: { type: String },
	currencyID: { type: String, regEx: SimpleSchema.RegEx.Id },
	invoiceID: { type: String, regEx: SimpleSchema.RegEx.Id },
	productID: { type: String, regEx: SimpleSchema.RegEx.Id },
	uomID: { type: String, regEx: SimpleSchema.RegEx.Id },
	price: { type: Number, defaultValue: 0 },
	quantity: { type: Number, defaultValue: 0 },
	receivedQuantity: { type: Number, defaultValue: 0 },
	status: { type: Number, defaultValue: 0 },
	grandTotal: { type: Number, defaultValue: 0 },
	subTotal: { type: Number, defaultValue: 0 },
	discountTotal: { type: Number, defaultValue: 0 },
	discountPercentage: { type: Number, defaultValue: 0 },
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
InvoicesTransactionsItemsCollections.schema = invoicesTransactionsItemsSchema;
