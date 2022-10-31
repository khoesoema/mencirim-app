import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const AccountsCollections = new Mongo.Collection('mst_accounts');

export const accountsSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	balanceType: { type: Number, defaultValue: 0 },
	accountType: { type: Number, defaultValue: 0 },
	accountSubType: { type: Number, defaultValue: 0 },
	isGeneral: { type: Number, defaultValue: 0 },
	isBank: { type: Number, defaultValue: 0 },
	isCheque: { type: Number, defaultValue: 0 },
	shortName: { type: String },
	initialBalance: { type: Number, defaultValue: 0 },
	actualBalance: { type: Number, defaultValue: 0 },
	creditedAmount: { type: Number, defaultValue: 0 },
	debitedAmount: { type: Number, defaultValue: 0 },
	parentID: { type: String, regEx: SimpleSchema.RegEx.Id },
	currencyID: { type: String, regEx: SimpleSchema.RegEx.Id },
	hasChild: { type: Number, defaultValue: 0 },
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
AccountsCollections.schema = accountsSchema;
