import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { PageRoutes } from './private/Routers';
import { LoginPage } from './public/Login';

import 'rsuite/dist/rsuite.min.css';
import './assets/css/adminlte.css';
import './assets/css/general.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap-daterangepicker/daterangepicker.css';

import Loader from 'rsuite/Loader';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

// import { connectToSocket } from '../src/redux/slicer/Socket';

export function EntryPoint(props) {
	const [userData, userLoading] = useTracker(() => {
		let subs = Meteor.subscribe('user', {});

		let data = Meteor.user();
		return [data, !subs.ready()];
	}, []);

	return (
		<>
			{userLoading ? (
				<Loader size="lg" center content="Loading Data" />
			) : userData ? (
				<PageRoutes />
			) : (
				<LoginPage />
			)}
		</>
	);
}
