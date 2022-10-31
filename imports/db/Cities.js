import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CitiesCollections = new Mongo.Collection('mst_cities');

export const citiesSchema = new SimpleSchema({
	countryID: { type: String, regEx: SimpleSchema.RegEx.Id },
	countryCode: { type: String },
	countryName: { type: String },
	stateID: { type: String, regEx: SimpleSchema.RegEx.Id },
	stateCode: { type: String },
	stateName: { type: String },
	name: { type: String },
	lastUpdate: {
		type: Date,
		defaultValue: Date.now,
	},
});
CitiesCollections.schema = citiesSchema;

if(Meteor.isServer){

	CitiesCollections.rawCollection().createIndex({
		countryCode: 1,
		countryName: 1,
		stateCode: 1,
		stateName: 1,
		name: 1,
	});
	
	CitiesCollections.rawCollection().createIndex({
		countryCode: 1,
		countryName: 1,
	});
	
	CitiesCollections.rawCollection().createIndex({
		countryCode: 1,
		countryName: 1,
		stateCode: 1,
		stateName: 1,
	});
	CitiesCollections.rawCollection().createIndex({
		stateCode: 1,
		stateName: 1,
	});
	
	CitiesCollections.rawCollection().createIndex({
		name: 1,
	});
	CitiesCollections.rawCollection().createIndex({
		stateCode: 1,
		stateName: 1,
		name: 1,
	});
	
	
	CitiesCollections.rawCollection().createIndex({
		countryCode: 1,
		stateCode: 1,
		name: 1,
	});
	CitiesCollections.rawCollection().createIndex({
		stateCode: 1,
		name: 1,
	});
	
	CitiesCollections.rawCollection().createIndex({
		countryCode: 1,
		stateCode: 1,
	});
}