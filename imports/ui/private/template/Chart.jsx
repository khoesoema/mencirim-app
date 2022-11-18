import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Title from './Title';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { ProductsHistoriesCollections } from '../../../db/Products';

import BarChart from "../components/BarChart";

export default function Chart() {
    const theme = useTheme();

    const [tahun, setTahun] = React.useState(new Date());
	const [chartData, setChartData] = React.useState({});
	
	const [haveData, setHaveData] = React.useState(false);

    const toMonthName = (monthNumber) => {
		const date = new Date();
		date.setMonth(monthNumber - 1);
	  
		return date.toLocaleString('en-US', {
		  month: 'short',
		});
	}

    const [productshistories2, productshistories2Loading] = useTracker(() => {
        let subs = Meteor.subscribe('productshistories.sumHargaYear', { tahun });
        let data = [];

        if (tahun) {
            data = ProductsHistoriesCollections.find({}).fetch();
        }

        let dataTahun = [];

        for (let i = 0; i < 12; i++) {

            let pembelian = 0;
            let returPembelian = 0;
            let penjualan = 0;
            let returPenjualan = 0;
            let profit = 0;

            data.map((item) => {
                if (item.month === i + 1) {
                    if (item.jenis === 'Pembelian') {
                        pembelian = item.total;
                    }
                    if (item.jenis === 'Retur Pembelian') {
                        returPembelian = item.total;
                    }
                    if (item.jenis === 'Penjualan') {
                        penjualan = item.total;
                        profit = item.profit;
                    }
                    if (item.jenis === 'Retur Penjualan') {
                        returPenjualan = item.total;
                        profit -= item.profit;
                    }
                }
            })

            dataTahun[i] = {
                id: i + 1,
                bulan: toMonthName(i + 1),
                beli: pembelian - returPembelian,
                jual: penjualan - returPenjualan,
            }
        }
        console.log(dataTahun);
        return [dataTahun, !subs.ready()];
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData({
                    labels: productshistories2.map((item) => item.bulan),
                    datasets: [
                        {
                            label: "Total Pembelian",
                            data: productshistories2.map((item) => item.beli),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 1,
                        },
                        {
                            label: "Total Penjualan",
                            data: productshistories2.map((item) => item.jual),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 1,
                        },
                    ],
                });
                setHaveData(true);
            } catch (error) {
                setHaveData(false);
                console.log(error);
            }
        }
        fetchData();
    }, [productshistories2, productshistories2Loading]);

    return (
        <React.Fragment>
            <Title>Total Penjualan dan Pembelian Periode Tahun {new Date().getUTCFullYear()}</Title>
            <div> {haveData && <BarChart chartData={chartData} />}</div>
        </React.Fragment>
    );
}