import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CountriesCollections = new Mongo.Collection('mst_countries');

export const countriesSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	lastUpdate: {
		type: Date,
		defaultValue: Date.now,
	},
});
if(Meteor.isServer){
	
CountriesCollections.schema = countriesSchema;

CountriesCollections.rawCollection().createIndex({
	name: 1,
	code: 1,
});

CountriesCollections.rawCollection().createIndex({
	name: 1,
});

CountriesCollections.rawCollection().createIndex({
	code: 1,
});
}