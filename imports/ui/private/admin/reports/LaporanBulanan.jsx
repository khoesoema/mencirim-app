import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';

import Breadcrumb from 'rsuite/Breadcrumb';
import DatePicker from 'rsuite/DatePicker';
import Stack from 'rsuite/Stack';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';

import { ProductsHistoriesCollections } from '../../../../db/Products';

import { Topbar } from '../../template/Topbar';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function LaporanBulanan() {
	let navigate = useNavigate();

    const [bulan, setBulan] = useState(new Date());

    const [totalPembelian, setTotalPembelian] = useState(0);
    const [totalReturPembelian, setTotalReturPembelian] = useState(0);
    const [totalPenjualan, setTotalPenjualan] = useState(0);
    const [totalReturPenjualan, setTotalReturPenjualan] = useState(0);
    const [profit, setProfit] = useState(0);

	const [productshistories, productshistoriesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('productshistories.sumHarga',{bulan});
        let data = [];

        if(bulan){
             data =  ProductsHistoriesCollections.find({}).fetch();
        }
		
        console.log(data);
		return [data, !subs.ready()];
	}, [bulan]);
	
    useEffect(()=>{
        if  (productshistories && productshistoriesLoading === false) {
            setTotalPembelian(0);
            setTotalReturPembelian(0);
            setTotalPenjualan(0);
            setTotalReturPenjualan(0);
            setProfit(0);
            let pft = 0;
            productshistories.map((item) => {
                if (item._id === 'Pembelian') {
                    setTotalPembelian(item.total);
                }
                if (item._id === 'Retur Pembelian') {
                    setTotalReturPembelian(item.total);
                }
                if (item._id === 'Penjualan') {
                    setTotalPenjualan(item.total);
                    pft += item.profit;
                    setProfit(item.profit);
                }
                if (item._id === 'Retur Penjualan') {
                    setTotalReturPenjualan(item.total);
                    pft += item.profit;
                    setProfit(pft);
                }
            })
        } else if(!productshistories && productshistoriesLoading === false){
            setTotalPembelian(0);
            setTotalReturPembelian(0);
            setTotalPenjualan(0);
            setTotalReturPenjualan(0);
            setProfit(0);
        };
    },[bulan, productshistories, productshistoriesLoading])

	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	const formatNum0 = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(0)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	return (
		<>
			<Topbar />
			<div className="mainContent">
				<div className="breadcrumContainer">
					<Breadcrumb
						separator={<ArrowRightIcon />}
						className="m-0"
					>
						<Breadcrumb.Item onClick={(e) => navigate('/')}>
							Dashboard
						</Breadcrumb.Item>
						<Breadcrumb.Item active>
							Laporan Bulanan
						</Breadcrumb.Item>
					</Breadcrumb>
				</div>
				<h6>
					<b>Laporan Bulanan</b>
				</h6>
				<hr />
                <Stack spacing={20}>
                    Bulan :
                    <DatePicker 
                        oneTap 
                        format="yyyy-MM" 
                        ranges={[]}
                        value={bulan}
                        onChange={(e)=> { setBulan(e) } }
                        onClean={()=>{
                            setTotalPembelian(0);
                            setTotalReturPembelian(0);
                            setTotalPenjualan(0);
                            setTotalReturPenjualan(0);
                            setProfit(0);
                        }}
                    />
                </Stack>
				<hr />
				<Card style={{ width: "50%" }}>
                    <Card.Header className="text-center"><strong>{'Laporan Bulan - ' + moment(bulan).format( 'MMMM YYYY')}</strong></Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>
                                <div>Total Pembelian</div>
                                <div>Total Retur Pembelian</div>
                                <br />
                                <div>Total Penjualan</div>
                                <div>Total Retur Penjualan</div>
                                <br />
                                <div>{ 'Total Profit Penjualan (' + formatNum(profit/(totalPenjualan-totalReturPenjualan) * 100 ) + ' %)' }</div>
                            </Col>
                            <Col className="text-right">
                                <div>{formatNum(totalPembelian)}</div>
                                <div>{formatNum(totalReturPembelian)}</div>
                                <br />
                                <div>{formatNum(totalPenjualan)}</div>
                                <div>{formatNum(totalReturPenjualan)}</div>
                                <br />
                                <div>{formatNum(profit)}</div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
			</div>
		</>
	);
}
