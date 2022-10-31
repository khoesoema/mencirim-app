import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const TaxCodesCollections = new Mongo.Collection('mst_tax_codes');

export const taxCodesSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	amount: { type: Number, defaultValue: 0 },
	sellAccountID: { type: String, regEx: SimpleSchema.RegEx.Id },
	purchaseAccountID: { type: String, regEx: SimpleSchema.RegEx.Id },
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
TaxCodesCollections.schema = taxCodesSchema;
