import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Title from './Title';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { ProductsHistoriesCollections } from '../../../db/Products';

import DoughnutChart from '../components/DoughnutChart';

export default function Chart2() {
    const theme = useTheme();

    const userData2 = {
		labels: [
		  'Member',
		  'Non-Member'
		],
		datasets: [{
		  label: 'Member Dataset',
		  data: [50, 500],
		  backgroundColor: [
			'rgb(54, 162, 235)',
			'rgb(75, 192, 192)'
		  ],
		  hoverOffset: 4
		}]
	};

    return (
        <React.Fragment>
            <Title>Total Customer Bulan {moment(new Date()).format('MMMM')}</Title>
            <div ><DoughnutChart chartData={userData2}></DoughnutChart></div>
        </React.Fragment>
    );
}