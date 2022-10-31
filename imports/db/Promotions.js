import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PromotionsCollections = new Mongo.Collection('promotions');

export const promotionsSchema = new SimpleSchema({
	promoNo: { type: String },
	startDate: { type: Date, defaultValue: Date.now },
	endDate: { type: Date, defaultValue: Date.now },
	target: { type: Number, defaultValue: 0 },
	keterangan: { type: String },
	createdAt: { type: Date, defaultValue: Date.now },
	createdBy: { type: String },
	modifiedAt: { type: Date, defaultValue: Date.now },
	modifiedBy: { type: String },
});
PromotionsCollections.schema = promotionsSchema;