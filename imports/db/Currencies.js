import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CurrenciesCollections = new Mongo.Collection('dataCurrency');

export const currenciesSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	kurs: { type : Number, defaultValue:0},
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
CurrenciesCollections.schema = currenciesSchema;
