import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const StatesCollections = new Mongo.Collection('mst_states');

export const statesSchema = new SimpleSchema({
	countryID: { type: String, regEx: SimpleSchema.RegEx.Id },
	countryCode: { type: String },
	countryName: { type: String },
	name: { type: String },
	code: { type: String },
	lastUpdate: {
		type: Date,
		defaultValue: Date.now,
	},
});

if(Meteor.isServer){
	
StatesCollections.schema = statesSchema;

StatesCollections.rawCollection().createIndex({
	countryCode: 1,
	countryName: 1,
	name: 1,
	code: 1,
});

StatesCollections.rawCollection().createIndex({
	countryCode: 1,
	countryName: 1,
});
StatesCollections.rawCollection().createIndex({
	countryCode: 1,
	countryName: 1,
	code: 1,
});
StatesCollections.rawCollection().createIndex({
	countryCode: 1,
	countryName: 1,
	name: 1,
});

StatesCollections.rawCollection().createIndex({
	name: 1,
	code: 1,
});

StatesCollections.rawCollection().createIndex({
	name: 1,
});
StatesCollections.rawCollection().createIndex({
	code: 1,
});

StatesCollections.rawCollection().createIndex({
	countryCode: 1,
});

StatesCollections.rawCollection().createIndex({
	countryCode: 1,
	name: 1,
});
StatesCollections.rawCollection().createIndex({
	countryCode: 1,
	code: 1,
});
}